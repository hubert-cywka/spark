import { RenderCellProps, RenderGroupCellProps } from "react-data-grid";
import { StarIcon, StarOffIcon } from "lucide-react";

import styles from "./styles/IsFeaturedCellRenderer.module.scss";

import { Badge } from "@/components/Badge";
import { GroupCellRenderer } from "@/components/DataGrid/renderers/GroupCellRenderer.tsx";
import { DetailedEntry } from "@/features/entries/types/Entry";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

type IsFeaturedCellValueRendererProps = {
    value: boolean;
};

export const IsFeaturedCellValueRenderer = ({ value }: IsFeaturedCellValueRendererProps) => {
    const t = useTranslate();

    return value ? (
        <Badge label={t("entries.values.featured")} icon={StarIcon} variant="secondary" className={styles.badge} />
    ) : (
        <Badge label={t("entries.values.notFeatured")} icon={StarOffIcon} className={styles.badge} />
    );
};

export const IsFeaturedCellRenderer = ({ row }: RenderCellProps<DetailedEntry>) => {
    return <IsFeaturedCellValueRenderer value={row.isFeatured} />;
};

export const IsFeaturedGroupCellRenderer = (p: RenderGroupCellProps<DetailedEntry>) => {
    return (
        <GroupCellRenderer {...p}>
            <IsFeaturedCellValueRenderer value={p.row.childRows[0].isFeatured} />
        </GroupCellRenderer>
    );
};
