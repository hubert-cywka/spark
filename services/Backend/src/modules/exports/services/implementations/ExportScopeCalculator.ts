import { Injectable } from "@nestjs/common";
import dayjs from "dayjs";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { IExportScopeCalculator } from "@/modules/exports/services/interfaces/IExportScopeCalculator";
import { DateRange } from "@/types/Date";

@Injectable()
export class ExportScopeCalculator implements IExportScopeCalculator {
    public findMissingScopes(requiredScopes: DataExportScope[], manifests: ExportAttachmentManifest[]): DataExportScope[] {
        const completedScopes = manifests.flatMap((manifest) => manifest.scopes);
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

    public trimScopesAfter(scopes: DataExportScope[], cutoffDate: Date): DataExportScope[] {
        const cutoff = dayjs(cutoffDate);
        const trimmedScopes: DataExportScope[] = [];

        for (const scope of scopes) {
            const scopeFrom = dayjs(scope.dateRange.from);
            const scopeTo = dayjs(scope.dateRange.to);

            if (scopeFrom.isAfter(cutoff)) {
                continue;
            }

            const cloned = this.cloneScope(scope);

            if (scopeTo.isAfter(cutoff)) {
                cloned.dateRange.to = cutoffDate;
            }

            trimmedScopes.push(cloned);
        }

        return trimmedScopes;
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

    private calculateDateGaps(required: DateRange, existing: DateRange[]): DateRange[] {
        let gaps: DateRange[] = [required];

        for (const filled of existing) {
            gaps = gaps.flatMap((gap) => this.excludeRange(gap, filled));
        }

        return gaps;
    }

    private excludeRange(target: DateRange, toExclude: DateRange): DateRange[] {
        const result: DateRange[] = [];
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
                to: excludeFrom.subtract(1, "day").toDate(),
            });
        }

        if (excludeTo.isBefore(targetTo)) {
            result.push({
                from: excludeTo.add(1, "day").toDate(),
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

    private areRangesTouchingOrOverlapping(r1: DateRange, r2: DateRange): boolean {
        const endOfFirst = dayjs(r1.to).add(1, "day");
        const startOfSecond = dayjs(r2.from);
        return startOfSecond.isBefore(endOfFirst) || startOfSecond.isSame(endOfFirst);
    }

    private getLatestDate(d1: Date, d2: Date): Date {
        return dayjs(d1).isAfter(dayjs(d2)) ? d1 : d2;
    }

    private cloneScope(scope: DataExportScope): DataExportScope {
        return { domain: scope.domain, dateRange: { ...scope.dateRange } };
    }
}
