import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

import { ExportScopeCalculator } from "@/modules/exports/services/implementations/ExportScopeCalculator";
import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";
import { ExportAttachmentManifest } from "@/modules/exports/shared/models/ExportAttachment.model";
import { DataExportScopeDomain } from "@/modules/exports/shared/types/DataExportScopeDomain";
import { ExportAttachmentStage } from "@/modules/exports/shared/types/ExportAttachmentStage";

dayjs.extend(utc);

describe("ExportScopeCalculator", () => {
    const date = (d: string) => dayjs(d).toDate();

    const MAIN_DOMAIN = "main_domain" as DataExportScopeDomain;
    const OTHER_DOMAIN = "other_domain" as DataExportScopeDomain;

    const JAN_01 = date("2025-01-01");
    const JAN_05 = date("2025-01-05");
    const JAN_06 = date("2025-01-06");
    const JAN_09 = date("2025-01-09");
    const JAN_10 = date("2025-01-10");
    const JAN_14 = date("2025-01-14");
    const JAN_15 = date("2025-01-15");
    const JAN_16 = date("2025-01-16");
    const JAN_20 = date("2025-01-20");
    const JAN_21 = date("2025-01-21");
    const JAN_25 = date("2025-01-25");
    const JAN_31 = date("2025-01-31");

    const PAST_JAN_10 = date("2024-01-10");
    const PAST_JAN_31 = date("2024-01-31");

    const calculator = new ExportScopeCalculator();

    describe("trimScopesAfter", () => {
        it("should not modify scopes that are entirely before the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_10 } },
                { domain: OTHER_DOMAIN, dateRange: { from: JAN_10, to: JAN_14 } },
            ];

            const result = calculator.trimScopesAfter(scopes, JAN_15);

            expect(result).toEqual(scopes);
        });

        it("should trim the 'to' date of scopes that overlap the cutoff date", () => {
            const scopes: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_10, to: JAN_20 } }];

            const result = calculator.trimScopesAfter(scopes, JAN_15);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_10, to: JAN_15 } }]);
        });

        it("should remove scopes that start after the cutoff date", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_10 } }, // Zostaje
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_16, to: JAN_31 } }, // Wylatuje (Start > 15ty)
            ];

            const result = calculator.trimScopesAfter(scopes, JAN_15);

            expect(result).toHaveLength(1);
            expect(result[0].dateRange.to).toEqual(JAN_10);
        });

        it("should trim scope to one day if it starts exactly on the cutoff date", () => {
            const scopes: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_15, to: JAN_25 } }];

            const result = calculator.trimScopesAfter(scopes, JAN_15);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_15, to: JAN_15 } }]);
        });
    });

    describe("mergeScopes", () => {
        it("should merge overlapping date ranges in the same domain", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_10 } },
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_05, to: JAN_15 } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_15 } }]);
        });

        it("should merge continuous date ranges", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_05 } },
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_06, to: JAN_10 } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_10 } }]);
        });

        it("should not merge overlapping ranges from different domains", () => {
            const scopes: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_10 } },
                { domain: OTHER_DOMAIN, dateRange: { from: JAN_05, to: JAN_15 } },
            ];

            const result = calculator.mergeScopes(scopes);

            expect(result).toHaveLength(2);
            expect(result.find((r) => r.domain === MAIN_DOMAIN)?.dateRange.to).toEqual(JAN_10);
        });
    });

    describe("findMissingScopes", () => {
        it("should return the full required range if no attachments exist", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }]);
        });

        it("should return the full required range if no attachments match", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: PAST_JAN_10, to: PAST_JAN_31 } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }]);
        });

        it("should identify a gap in the middle of a required range", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_10, to: JAN_20 } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_09 } },
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_21, to: JAN_31 } },
            ]);
        });

        it("should return empty array if required range is fully covered", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_10, to: JAN_20 } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_10, to: JAN_20 } }],
                    metadata: { checksum: "c1" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });

        it("should merge final missing scopes if they are adjacent", () => {
            const required: DataExportScope[] = [
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_20 } },
                { domain: MAIN_DOMAIN, dateRange: { from: JAN_21, to: JAN_31 } },
            ];
            const manifests: ExportAttachmentManifest[] = [];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_31 } }]);
        });

        it("should consider scope covered if all parts are present", () => {
            const required: DataExportScope[] = [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_01 } }];
            const manifests: ExportAttachmentManifest[] = [
                {
                    key: "k1",
                    path: "p1",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_01 } }],
                    metadata: { checksum: "c1" },
                },
                {
                    key: "k2",
                    path: "p2",
                    stage: ExportAttachmentStage.TEMPORARY,
                    scopes: [{ domain: MAIN_DOMAIN, dateRange: { from: JAN_01, to: JAN_01 } }],
                    metadata: { checksum: "c2" },
                },
            ];

            const result = calculator.findMissingScopes(required, manifests);

            expect(result).toEqual([]);
        });
    });
});
