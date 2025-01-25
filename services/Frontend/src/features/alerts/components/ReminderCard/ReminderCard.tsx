import { Trash } from "lucide-react";

import styles from "./styles/ReminderCard.module.scss";

import { Card } from "@/components/Card";
import { IconButton } from "@/components/IconButton";
import { Toggle } from "@/components/Toggle";
import { AlertTimeInput } from "@/features/alerts/components/AlertTimeInput/AlertTimeInput";
import { DaysSelect } from "@/features/alerts/components/DaysSelect/DaysSelect";
import { Alert } from "@/features/alerts/types/Alert";
import { Day } from "@/types/Day";

type ReminderCardProps = {
    alert: Alert;
    onUpdateStatus: (value: boolean) => void;
    onUpdateTime: (value: string) => void;
    onUpdateDays: (value: Day[]) => void;
    onDelete: () => void;
};

export const ReminderCard = ({ alert, onUpdateStatus, onUpdateTime, onUpdateDays, onDelete }: ReminderCardProps) => {
    return (
        <Card key={alert.id} className={styles.container} variant="translucent">
            <div className={styles.wrapper}>
                <Toggle isSelected={alert.enabled} onChange={onUpdateStatus} size="3" />
                <AlertTimeInput value={alert.time} onChange={onUpdateTime} />
            </div>
            <DaysSelect selected={alert.daysOfWeek} onChange={onUpdateDays} />
            <IconButton iconSlot={Trash} onPress={onDelete} variant="subtle" />
        </Card>
    );
};
