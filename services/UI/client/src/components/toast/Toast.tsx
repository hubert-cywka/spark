import { IconX } from "@tabler/icons-react";

import { IconButton } from "@/components/iconButton/IconButton";
import { ToastStyled } from "@/components/toast/styles/Toast.styled";
import { ToastProps } from "@/components/toast/types/Toast";

export const Toast = ({ onClose, title, message, variant = "info" }: ToastProps) => {
    return (
        <ToastStyled.Container variant={variant}>
            <p>
                <ToastStyled.Title>{title}</ToastStyled.Title>
                <ToastStyled.Message>{message}</ToastStyled.Message>
            </p>
            <IconButton onPress={onClose} variant="subtle" size="1">
                <IconX />
            </IconButton>
        </ToastStyled.Container>
    );
};
