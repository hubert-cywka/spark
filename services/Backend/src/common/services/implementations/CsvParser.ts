import { Injectable } from "@nestjs/common";

import { ICsvParser } from "@/common/services/interfaces/ICsvParser";

// TODO: Parse timestamps differently
@Injectable()
export class CsvParser implements ICsvParser {
    public toBlob(data: object[]): Blob {
        const csvContent = this.generateCsvString(data);
        return new Blob([csvContent], { type: "text/csv" });
    }

    public toBuffer(data: object[]): Buffer {
        const csvContent = this.generateCsvString(data);
        const encoder = new TextEncoder();
        return Buffer.from(encoder.encode(csvContent).buffer);
    }

    private generateCsvString(data: object[]): string {
        if (data.length === 0) {
            return "";
        }

        const headers = Object.keys(data[0]);

        const csvRows = data.map((row) =>
            headers
                .map((fieldName) => {
                    const value = (row as never)[fieldName] ?? "";
                    const escaped = String(value).replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(",")
        );

        return [headers.join(","), ...csvRows].join("\n");
    }
}
