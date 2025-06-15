import styles from "./styles/FeatureCard.module.scss";

import { Icon } from "@/components/Icon";
import { IconSlot } from "@/components/Icon/types/Icon";
import SpotlightCard from "@/components/SpotlightCard/SpotlightCard.tsx";

type FeatureCardProps = {
    icon: IconSlot;
    title: string;
    caption: string;
};

export const FeatureCard = ({ icon, caption, title }: FeatureCardProps) => {
    return (
        <SpotlightCard className={styles.card}>
            <header className={styles.header}>
                <Icon slot={icon} size="3" />
                <h2 className={styles.title}>{title}</h2>
            </header>
            <p className={styles.caption}>{caption}</p>
        </SpotlightCard>
    );
};
