import { toast } from "sonner";

import { Toast } from "@/components/toast/Toast";
import { ToastVariant } from "@/components/toast/types/Toast";

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
