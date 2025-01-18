import { ForwardRefExoticComponent } from "react";
import * as react from "react";
import { LucideProps } from "lucide-react";

export type IconSize = "1" | "2" | "3";

export type IconSlot = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & react.RefAttributes<SVGSVGElement>>;
