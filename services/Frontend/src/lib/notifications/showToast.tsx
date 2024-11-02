import { toast } from "sonner";

import { Toast } from "@/components/Toast/Toast";
import { ToastVariant } from "@/components/Toast/types/Toast";

export const showToast = () => {
    const createToast = (variant: ToastVariant) => (options: { message: string; title: string }) =>
        show(variant, options.title, options.message);

    const show = (variant: ToastVariant, title: string, message: string) => {
        toast.custom((t) => <Toast title={title} message={message} variant={variant} onClose={() => toast.dismiss(t)} />);
    };

    return {
        danger: createToast("danger"),
        info: createToast("info"),
        success: createToast("success"),
    };
};
