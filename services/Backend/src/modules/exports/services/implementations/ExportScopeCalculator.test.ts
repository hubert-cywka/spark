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
        const CUTOFF_DATE = "2025-06-15";

        it("should not modify scopes that are entirely before the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } },
                { domain: OTHER_DOMAIN, dateRange: { from: "2025-06-01", to: "2025-06-14" } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual(scopes);
        });

        it("should trim the 'to' date of scopes that overlap the cutoff date", () => {
            const scopes: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-06-10", to: "2025-06-20" } }];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-06-10", to: CUTOFF_DATE } }]);
        });

        it("should remove scopes that start after the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } },
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-06-16", to: "2025-06-30" } },
            ];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toHaveLength(1);
            expect(result[0].dateRange.to).toBe("2025-01-10");
        });

        it("should trim scope to one day if it starts exactly on the cutoff date", () => {
            const scopes: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-06-15", to: "2025-06-25" } }];

            const result = calculator.trimScopesAfter(scopes, CUTOFF_DATE);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-06-15", to: "2025-06-15" } }]);
        });
    });

    describe("mergeScopes", () => {
        it("should merge overlapping date ranges in the same domain", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } },
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-05", to: "2025-01-15" } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-15" } }]);
        });

        it("should merge continuous date ranges", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-05" } },
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-06", to: "2025-01-10" } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } }]);
        });

        it("should not merge overlapping ranges from different domains", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } },
                { domain: OTHER_DOMAIN, dateRange: { from: "2025-01-05", to: "2025-01-15" } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toHaveLength(2);
            expect(result.find((r) => r.domain === MAIN_DOMAIN)?.dateRange.to).toBe("2025-01-10");
        });
    });

    describe("findMissingScopes", () => {
        it("should return the full required range if no attachments exist", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }]);
        });

        it("should return the full required range if no attachments match", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2024-01-10", to: "2024-01-31" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }]);
        });

        it("should identify a gap in the middle of a required range", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-10", to: "2025-01-20" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-09" } },
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-21", to: "2025-01-31" } },
            ]);
        });

        it("should return empty array if required range is fully covered", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-10", to: "2025-01-20" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-10", to: "2025-01-20" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });

        it("should merge final missing scopes if they are adjacent", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-20" } },
                { domain: MAIN_DOMAIN, dateRange: { from: "2025-01-21", to: "2025-01-31" } },
            ];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-31" } }]);
        });

        it("should not count scope as covered if parts sequence is broken", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: 2 },
                },
                {
                    key: "k3",
                    path: "p3",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-10" } }],
                    metadata: { checksum: "c3", part: 3, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual(required);
        });

        it("should consider scope missing if not all parts are present", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: 2 },
                },
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 3, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual(required);
        });

        it("should consider scope missing if last part is missing", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: 2 },
                },
                {
                    key: "k2",
                    path: "p2",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c2", part: 2, nextPart: 3 },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual(required);
        });

        it("should consider scope covered if all parts are present", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: 2 },
                },
                {
                    key: "k2",
                    path: "p2",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c2", part: 2, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });

        it("should identify gaps when a multi-part sequence is incomplete in the middle", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: 2 },
                },
                {
                    key: "k3",
                    path: "p3",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c3", part: 3, nextPart: null },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual(required);
        });

        it("should handle mixed complete and incomplete manifests", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-02" } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-01", to: "2025-01-01" } }],
                    metadata: { checksum: "c1", part: 1, nextPart: null },
                },
                {
                    key: "k2",
                    path: "p2",
                    stage: ExportAttachmentStage.PARTIAL,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-02", to: "2025-01-02" } }],
                    metadata: { checksum: "c2", part: 1, nextPart: 2 },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: "2025-01-02", to: "2025-01-02" } }]);
        });
    });
});
