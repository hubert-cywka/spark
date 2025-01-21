import { Breadcrumb, Breadcrumbs as BaseBreadcrumbs } from "react-aria-components";
import { ChevronRight } from "lucide-react";

import styles from "./styles/Breadcrumbs.module.scss";

import { Anchor } from "@/components/Anchor";
import { Icon } from "@/components/Icon";

export type BreadcrumbsProps = {
    items: { label: string; href?: string }[];
};

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
    return (
        <BaseBreadcrumbs items={items} className={styles.container}>
            {items.map(({ label, href }, index) => (
                <Breadcrumb key={label} className={styles.breadcrumb}>
                    {href ? <Anchor href={href}>{label}</Anchor> : label}
                    {index < items.length - 1 && <Icon slot={ChevronRight} size="3" />}
                </Breadcrumb>
            ))}
        </BaseBreadcrumbs>
    );
};
