import { DataExportScope } from "@/modules/exports/shared/models/DataExportScope";

export type DataExportBatch = { batch: object[]; batchScope: DataExportScope };
