import { IconSize, IconSlot } from "@/components/Icon/types/Icon";

type IconProps = {
    slot: IconSlot;
    size?: IconSize;
    className?: string;
};

export const Icon = ({ slot: Slot, className, size = "2" }: IconProps) => {
    return <Slot className={className} size={mapIconSizeToSlotSize(size)} />;
};

const mapIconSizeToSlotSize = (size: IconSize) => {
    switch (size) {
        case "1":
            return 16;
        case "2":
            return 20;
        case "3":
            return;
    }
};
