import { useState } from "react";
import { Calendar, Trash, X } from "lucide-react";

import styles from "./styles/Day.module.scss";

import { IconButton } from "@/components/IconButton";
import { DayHeader } from "@/features/daily/components/DayHeader/DayHeader";
import { DeleteDailyModal } from "@/features/daily/components/DeleteDailyModal/DeleteDailyModal";
import { Daily } from "@/features/daily/types/Daily";
import { useOutsideClick } from "@/hooks/useOutsideClick";

type DayProps = {
    daily: Daily;
};

export const Day = ({ daily }: DayProps) => {
    const [isEdited, setIsEdited] = useState(false);

    const startEditMode = () => {
        setIsEdited(true);
    };

    const cancelEditMode = () => {
        setIsEdited(false);
    };

    const ref = useOutsideClick<HTMLDivElement>(cancelEditMode);

    return (
        <div className={styles.container}>
            <div className={styles.header} ref={ref}>
                <DayHeader date={daily.date} isEdited={isEdited} onChange={(res) => console.log(res)} />

                <div className={styles.buttons}>
                    {isEdited ? (
                        <IconButton variant="secondary" size="1" onPress={cancelEditMode}>
                            <X />
                        </IconButton>
                    ) : (
                        <IconButton variant="secondary" size="1" onPress={startEditMode}>
                            <Calendar />
                        </IconButton>
                    )}

                    <DeleteDailyModal
                        daily={daily}
                        trigger={({ onClick }) => (
                            <IconButton variant="danger" size="1" onPress={onClick}>
                                <Trash />
                            </IconButton>
                        )}
                    />
                </div>
            </div>

            <ul>
                <li>Something something</li>
                <li>Something something something something</li>
                <li>Something something something</li>
                <li>Something</li>
                <li>Something something</li>
                <li>Something something something</li>
            </ul>
        </div>
    );
};
