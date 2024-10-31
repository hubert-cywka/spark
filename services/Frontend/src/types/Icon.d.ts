import { ForwardRefExoticComponent, RefAttributes } from "react";
import { Icon, IconProps } from "@tabler/icons-react";

export type IconComponent = ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
