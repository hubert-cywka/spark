import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon } from "lucide-react";

export type IconComponent = ForwardRefExoticComponent<
    RefAttributes<Icon> & {
        className?: string;
    }
>;
