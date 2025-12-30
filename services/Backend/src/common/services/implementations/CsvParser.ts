import { Injectable } from "@nestjs/common";

import { ICsvParser } from "@/common/services/interfaces/ICsvParser";

@Injectable()
export class CsvParser implements ICsvParser {
    public toCsvBlob(data: object[]): Blob {
        if (data.length === 0) {
            return new Blob([""], { type: "text/csv" });
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

        const csvContent = [headers.join(","), ...csvRows].join("\n");
        return new Blob([csvContent], { type: "text/csv" });
    }
}
