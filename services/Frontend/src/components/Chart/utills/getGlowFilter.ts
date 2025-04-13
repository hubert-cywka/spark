import { Color } from "@/types/Color";

export const getGlowFilter = (color: Color) => `drop-shadow(0px 0px 5px ${color})`;
