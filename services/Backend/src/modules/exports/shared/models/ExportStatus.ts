export type ExportStatus = {
    exportId: string;
    domain: string;
    exportedUntil: Date | null;
    nextCursor: string | null;
};
