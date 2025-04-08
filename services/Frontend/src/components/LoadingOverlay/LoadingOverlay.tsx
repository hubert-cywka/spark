import { Overlay } from "@/components/Overlay";
import { Spinner } from "@/components/Spinner";

export const LoadingOverlay = () => {
    return (
        <Overlay variant="translucent" aria-busy="true">
            <Spinner />
        </Overlay>
    );
};
