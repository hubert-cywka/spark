export type ToastVariant = "success" | "danger" | "info";

export type ToastProps = {
    variant?: ToastVariant;
    title: string;
    message: string;
    onClose: () => void;
};
