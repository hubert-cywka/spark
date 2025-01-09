import { ReactNode } from "react";

export type ModalTriggerProps = {
    onClick: () => void;
};

export type ModalTrigger = (props: ModalTriggerProps) => ReactNode;
