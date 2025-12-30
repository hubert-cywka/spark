import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { formatToISODateString } from "@/common/utils/dateUtils";
import { IExportScopeCalculator } from "@/modules/privacy/services/interfaces/IExportScopeCalculator";
import { ISODateString, ISODateStringRange } from "@/types/Date";

// TODO: Refactor
@Injectable()
export class ExportScopeCalculator implements IExportScopeCalculator {
    public findMissingScopes(requiredScopes: DataExportScope[], manifests: ExportAttachmentManifest[]): DataExportScope[] {
        const completedScopes = this.filterCompletedManifests(manifests);
        const existingMerged = this.mergeScopes(completedScopes);
        const requiredMerged = this.mergeScopes(requiredScopes);

        const missingScopes: DataExportScope[] = [];

        for (const required of requiredMerged) {
            const relevantExisting = existingMerged.filter((e) => e.domain === required.domain).map((e) => e.dateRange);

            const gaps = this.calculateDateGaps(required.dateRange, relevantExisting);

            gaps.forEach((gap) => {
                missingScopes.push({ domain: required.domain, dateRange: gap });
            });
        }

        return this.mergeScopes(missingScopes);
    }

    public mergeScopes(scopes: DataExportScope[]): DataExportScope[] {
        if (scopes.length <= 1) {
            return scopes;
        }

        const scopesByDomain = this.groupScopesByDomain(scopes);
        const mergedResults: DataExportScope[] = [];

        for (const domain in scopesByDomain) {
            mergedResults.push(...this.mergeDomainRanges(scopesByDomain[domain]));
        }

        return mergedResults;
    }

    private filterCompletedManifests(manifests: ExportAttachmentManifest[]): DataExportScope[] {
        const grouped = manifests.reduce(
            (acc, manifest) => {
                const key = `${manifest.scope.domain}|${manifest.scope.dateRange.from}|${manifest.scope.dateRange.to}`;
                if (!acc[key]) {
                    acc[key] = { scope: manifest.scope, parts: new Set<number>(), hasEnd: false };
                }
                acc[key].parts.add(manifest.metadata.part);
                if (manifest.metadata.nextPart === null) {
                    acc[key].hasEnd = true;
                }
                return acc;
            },
            {} as Record<string, { scope: DataExportScope; parts: Set<number>; hasEnd: boolean }>
        );

        const completedScopes: DataExportScope[] = [];

        for (const key in grouped) {
            const entry = grouped[key];
            if (this.isSequenceComplete(entry.parts, entry.hasEnd)) {
                completedScopes.push(entry.scope);
            }
        }

        return completedScopes;
    }

    private isSequenceComplete(parts: Set<number>, hasEnd: boolean): boolean {
        if (!hasEnd) return false;
        const sortedParts = Array.from(parts).sort((a, b) => a - b);
        if (sortedParts[0] !== 1) return false;

        for (let i = 0; i < sortedParts.length - 1; i++) {
            if (sortedParts[i + 1] !== sortedParts[i] + 1) {
                return false;
            }
        }
        return true;
    }

    private mergeDomainRanges(domainScopes: DataExportScope[]): DataExportScope[] {
        const sorted = this.sortScopesChronologically(domainScopes);
        const merged: DataExportScope[] = [this.cloneScope(sorted[0])];

        for (let i = 1; i < sorted.length; i++) {
            const last = merged[merged.length - 1];
            const current = sorted[i];

            if (this.areRangesTouchingOrOverlapping(last.dateRange, current.dateRange)) {
                last.dateRange.to = this.getLatestDate(last.dateRange.to, current.dateRange.to);
            } else {
                merged.push(this.cloneScope(current));
            }
        }

        return merged;
    }

    private calculateDateGaps(required: ISODateStringRange, existing: ISODateStringRange[]): ISODateStringRange[] {
        let gaps: ISODateStringRange[] = [required];

        for (const filled of existing) {
            gaps = gaps.flatMap((gap) => this.excludeRange(gap, filled));
        }

        return gaps;
    }

    private excludeRange(target: ISODateStringRange, toExclude: ISODateStringRange): ISODateStringRange[] {
        const result: ISODateStringRange[] = [];
        const targetFrom = dayjs(target.from);
        const targetTo = dayjs(target.to);
        const excludeFrom = dayjs(toExclude.from);
        const excludeTo = dayjs(toExclude.to);

        if (excludeTo.isBefore(targetFrom) || excludeFrom.isAfter(targetTo)) {
            return [target];
        }

        if (excludeFrom.isAfter(targetFrom)) {
            result.push({
                from: target.from,
                to: formatToISODateString(excludeFrom.subtract(1, "day").toDate()),
            });
        }

        if (excludeTo.isBefore(targetTo)) {
            result.push({
                from: formatToISODateString(excludeTo.add(1, "day").toDate()),
                to: target.to,
            });
        }

        return result;
    }

    private groupScopesByDomain(scopes: DataExportScope[]): Record<string, DataExportScope[]> {
        return scopes.reduce(
            (acc, scope) => {
                (acc[scope.domain] = acc[scope.domain] || []).push(scope);
                return acc;
            },
            {} as Record<string, DataExportScope[]>
        );
    }

    private sortScopesChronologically(scopes: DataExportScope[]): DataExportScope[] {
        return [...scopes].sort((a, b) => dayjs(a.dateRange.from).valueOf() - dayjs(b.dateRange.from).valueOf());
    }

    private areRangesTouchingOrOverlapping(r1: ISODateStringRange, r2: ISODateStringRange): boolean {
        const endOfFirst = dayjs(r1.to).add(1, "day");
        const startOfSecond = dayjs(r2.from);
        return startOfSecond.isBefore(endOfFirst) || startOfSecond.isSame(endOfFirst);
    }

    private getLatestDate(d1: ISODateString, d2: ISODateString): ISODateString {
        return dayjs(d1).isAfter(dayjs(d2)) ? d1 : d2;
    }

    private cloneScope(scope: DataExportScope): DataExportScope {
        return { domain: scope.domain, dateRange: { ...scope.dateRange } };
    }
}
