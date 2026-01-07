import { DataExportScope } from "@/common/export/models/DataExportScope";
import { DataExportScopeDomain } from "@/common/export/types/DataExportScopeDomain";
import { DateRange } from "@/types/Date";

export class DataExportAttachmentPathBuilder {
    private exportId?: string;
    private domain?: DataExportScopeDomain;
    private dateRange?: DateRange;
    private filename?: string;

    private constructor() {}

    public static forExport(exportId: string): DataExportAttachmentPathBuilder {
        const builder = new DataExportAttachmentPathBuilder();

        builder.setExportId(exportId);
        return builder;
    }

    public setExportId(exportId: string): this {
        this.exportId = exportId;
        return this;
    }

    public setScope(scope: DataExportScope): this {
        this.dateRange = scope.dateRange;
        this.domain = scope.domain;
        return this;
    }

    public setFilename(filename: string): this {
        this.filename = filename;
        return this;
    }

    public build(): string {
        if (!this.exportId) {
            throw new Error("Export's ID is required to build a path.");
        }

        const parts: string[] = ["exports", this.exportId];

        if (this.domain) {
            parts.push(this.domain);
        }

        if (this.dateRange) {
            const { from, to } = this.dateRange;
            parts.push(`${from.toISOString()}_${to.toISOString()}`);
        }

        if (this.filename) {
            parts.push(this.filename);
        }

        return parts.join("/");
    }
}
