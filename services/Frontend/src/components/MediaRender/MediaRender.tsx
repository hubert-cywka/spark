import { MediaRenderProps } from "@/components/MediaRender/types/MediaRender";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const MediaRender = ({ minWidth, maxWidth, children }: MediaRenderProps) => {
    const minDeviceSize = useMediaQuery(`(min-width: ${minWidth}px)`);
    const maxDeviceSize = useMediaQuery(`(max-width: ${maxWidth}px)`);

    return <>{(maxDeviceSize || minDeviceSize) && children}</>;
};
