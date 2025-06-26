import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

import { Badge } from "@/components/Badge";
import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { EntryDetail } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type IsCompletedCellValueRendererProps = {
    value: boolean;
};

const IsCompletedCellValueRenderer = ({ value }: IsCompletedCellValueRendererProps) => {
    const t = useTranslate();

    return value ? (
        <Badge label={t("entries.values.completed")} icon={SquareCheckIcon} variant="success" />
    ) : (
        <Badge label={t("entries.values.pending")} icon={SquareIcon} />
    );
};

export const IsCompletedCellRenderer = ({ row }: RenderCellProps<EntryDetail>) => {
    return <IsCompletedCellValueRenderer value={row.isCompleted} />;
};

export const IsCompletedGroupCellRenderer = (p: RenderGroupCellProps<EntryDetail>) => {
    return (
        <GroupCellRenderer {...p}>
            <IsCompletedCellValueRenderer value={p.row.childRows[0].isCompleted} />
        </GroupCellRenderer>
    );
};
