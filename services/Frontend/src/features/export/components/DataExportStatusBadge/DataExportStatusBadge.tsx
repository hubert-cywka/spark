import { SquareCheckIcon, TimerIcon, XIcon } from "lucide-react";

import { Badge } from "@/components/Badge";
import { DataExportStatus } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type DataExportStatusBadgeProps = {
    status: DataExportStatus;
};

export const DataExportStatusBadge = ({ status }: DataExportStatusBadgeProps) => {
    const t = useTranslate();

    return <Badge label={t(mapStatusToLabel(status))} variant={mapStatusToVariant(status)} icon={mapStatusToIcon(status)} />;
};

const mapStatusToLabel = (status: DataExportStatus) => {
    switch (status) {
        case "completed":
            return "exports.common.status.completed";
        case "cancelled":
            return "exports.common.status.cancelled";
        default:
            return "exports.common.status.pending";
    }
};

const mapStatusToVariant = (status: DataExportStatus) => {
    switch (status) {
        case "completed":
            return "success";
        case "cancelled":
            return "danger";
        default:
            return "info";
    }
};

const mapStatusToIcon = (status: DataExportStatus) => {
    switch (status) {
        case "completed":
            return SquareCheckIcon;
        case "cancelled":
            return XIcon;
        default:
            return TimerIcon;
    }
};
