import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";
import { SquareCheckIcon, SquareIcon } from "lucide-react";

import styles from "./styles/IsFeaturedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { EntryDetail } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type IsFeaturedCellValueRendererProps = {
    value: boolean;
};

export const IsFeaturedCellValueRenderer = ({ value }: IsFeaturedCellValueRendererProps) => {
    const t = useTranslate();

    return value ? (
        <Badge label={t("entries.values.featured")} icon={SquareCheckIcon} variant="success" className={styles.badge} />
    ) : (
        <Badge label={t("entries.values.notFeatured")} icon={SquareIcon} className={styles.badge} />
    );
};

export const IsFeaturedCellRenderer = ({ row }: RenderCellProps<EntryDetail>) => {
    return <IsFeaturedCellValueRenderer value={row.isFeatured} />;
};

export const IsFeaturedGroupCellRenderer = (p: RenderGroupCellProps<EntryDetail>) => {
    return (
        <GroupCellRenderer {...p}>
            <IsFeaturedCellValueRenderer value={p.row.childRows[0].isFeatured} />
        </GroupCellRenderer>
    );
};
