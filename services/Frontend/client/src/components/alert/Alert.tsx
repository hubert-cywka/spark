import { useMemo } from "react";
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconMessageCircle } from "@tabler/icons-react";

import { AlertStyled } from "@/components/alert/styles/Alert.styled";
import { AlertProps } from "@/components/alert/types/Alert";

export const Alert = ({ children, variant }: AlertProps) => {
    const Icon = useMemo(() => {
        switch (variant) {
            case "success":
                return IconCircleCheck;
            case "danger":
                return IconAlertTriangle;
            case "info":
                return IconInfoCircle;
            case "neutral":
                return IconMessageCircle;
        }
    }, [variant]);

    return (
        <AlertStyled.Container variant={variant}>
            <AlertStyled.IconWrapper>
                <Icon />
            </AlertStyled.IconWrapper>
            <AlertStyled.Message>{children}</AlertStyled.Message>
        </AlertStyled.Container>
    );
};
