import { ForwardRefExoticComponent } from "react";
import * as react from "react";
import { LucideProps } from "lucide-react";

import { IconSize } from "@/components/Icon/types/Icon";

type IconProps = {
    slot: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
    size?: IconSize;
};

export const Icon = ({ slot: Slot, size = "2" }: IconProps) => {
    return <Slot size={mapIconSizeToSlotSize(size)} />;
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
