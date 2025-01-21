import { CSSProperties, HTMLAttributeAnchorTarget, PropsWithChildren } from "react";
import { LinkProps } from "next/link";

export type AnchorProps = PropsWithChildren<LinkProps> & {
    className?: string;
    style?: CSSProperties;
    rel?: string;
    target?: HTMLAttributeAnchorTarget;
};
