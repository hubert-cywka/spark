import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { DataExportScope } from "@/common/export/models/DataExportScope";
import { ExportAttachmentManifest } from "@/common/export/models/ExportAttachment.model";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { ExportAttachmentStage } from "@/common/export/types/ExportAttachmentStage";
import { ExportScopeCalculator } from "@/modules/exports/services/implementations/ExportScopeCalculator";

dayjs.extend(utc);

describe("ExportScopeCalculator", () => {
    const MAIN_DOMAIN = "main_domain" as DataExportScopeDomain;
    const OTHER_DOMAIN = "other_domain" as DataExportScopeDomain;
    const calculator = new ExportScopeCalculator();

    describe("trimScopesAfter", () => {
        const CUTOFF_DATE = dayjs("2025-06-15").toDate();

        it("should not modify scopes that are entirely before the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
                { domain: OTHER_DOMAIN, dateRange: { from: dayjs("2025-06-01").toDate(), to: dayjs("2025-06-14").toDate() } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual(scopes);
        });

        it("should trim the 'to' date of scopes that overlap the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-06-10").toDate(), to: dayjs("2025-06-20").toDate() } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-06-10").toDate(), to: CUTOFF_DATE } }]);
        });

        it("should remove scopes that start after the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-10").toDate() } },
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-06-16").toDate(), to: dayjs("2025-06-30").toDate() } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toHaveLength(1);
            expect(result[0].dateRange.to).toEqual(dayjs("2025-01-10").toDate());
        });

        it("should trim scope to one day if it starts exactly on the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-06-15").toDate(), to: dayjs("2025-06-25").toDate() } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-06-15").toDate(), to: dayjs("2025-06-15").toDate() } },
            ]);
        });
    });

    describe("mergeScopes", () => {
        it("should merge overlapping date ranges in the same domain", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-10").toDate() } },
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-05").toDate(), to: dayjs("2025-01-15").toDate() } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-15").toDate() } },
            ]);
        });

        it("should merge continuous date ranges", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-05").toDate() } },
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-06").toDate(), to: dayjs("2025-01-10").toDate() } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-10").toDate() } },
            ]);
        });

        it("should not merge overlapping ranges from different domains", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-10").toDate() } },
                { domain: OTHER_DOMAIN, dateRange: { from: dayjs("2025-01-05").toDate(), to: dayjs("2025-01-15").toDate() } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toHaveLength(2);
            expect(result.find((r) => r.domain === MAIN_DOMAIN)?.dateRange.to).toEqual(dayjs("2025-01-10").toDate());
        });
    });

    describe("findMissingScopes", () => {
        it("should return the full required range if no attachments exist", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ]);
        });

        it("should return the full required range if no attachments match", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2024-01-10").toDate(), to: dayjs("2024-01-31").toDate() } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ]);
        });

        it("should identify a gap in the middle of a required range", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-10").toDate(), to: dayjs("2025-01-20").toDate() } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-09").toDate() } },
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-21").toDate(), to: dayjs("2025-01-31").toDate() } },
            ]);
        });

        it("should return empty array if required range is fully covered", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-10").toDate(), to: dayjs("2025-01-20").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-10").toDate(), to: dayjs("2025-01-20").toDate() } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });

        it("should merge final missing scopes if they are adjacent", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-20").toDate() } },
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-21").toDate(), to: dayjs("2025-01-31").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-31").toDate() } },
            ]);
        });

        it("should consider scope covered if all parts are present", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-01").toDate() } },
            ];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-01").toDate() } }],
                    metadata: { checksum: "c1" },
                },
                {
                    key: "k2",
                    path: "p2",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: dayjs("2025-01-01").toDate(), to: dayjs("2025-01-01").toDate() } }],
                    metadata: { checksum: "c2" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });
    });
});
