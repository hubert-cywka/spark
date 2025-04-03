"use client";

import { PropsWithChildren, ReactNode } from "react";
import { Dialog, DialogTrigger, Modal as BaseModal, ModalOverlay } from "react-aria-components";

import styles from "./styles/Modal.module.scss";

type ModalProps = PropsWithChildren<{
    trigger?: ReactNode;
    isOpen?: boolean;
    onOpenChange?: (newValue: boolean) => unknown;
}>;

export const Modal = ({ children, trigger, onOpenChange, isOpen }: ModalProps) => {
    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            {trigger}
            <ModalOverlay className={styles.overlay}>
                <BaseModal className={styles.modal}>
                    <Dialog className={styles.dialog}>{children}</Dialog>
                </BaseModal>
            </ModalOverlay>
        </DialogTrigger>
    );
};
