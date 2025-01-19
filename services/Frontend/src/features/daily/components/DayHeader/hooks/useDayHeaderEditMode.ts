import { useState } from "react";

type UseDayHeaderEditModeOptions = {
    onCancel: () => void;
    onEnd: () => void;
};

export const useDayHeaderEditMode = ({ onCancel, onEnd }: UseDayHeaderEditModeOptions) => {
    const [isInEditMode, setIsInEditMode] = useState(false);
    const startEditMode = () => setIsInEditMode(true);

    const endEditMode = () => {
        setIsInEditMode(false);
        onEnd();
    };

    const cancelEditMode = () => {
        endEditMode();
        onCancel();
    };

    return { isInEditMode, endEditMode, cancelEditMode, startEditMode };
};
