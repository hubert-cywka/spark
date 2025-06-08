import { MouseEvent } from "react";

export const preventEventBubbling = (e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
};
