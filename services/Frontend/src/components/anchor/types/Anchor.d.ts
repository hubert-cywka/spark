import { PropsWithChildren } from "react";
import { LinkProps } from "next/link";

export type AnchorProps = PropsWithChildren<LinkProps> & { className?: string };
