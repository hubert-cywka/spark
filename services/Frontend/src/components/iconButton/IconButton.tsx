import clsx from "clsx";

import styles from "./styles/IconButton.module.scss";

import { Button, ButtonProps } from "@/components/Button";

export const IconButton = (props: ButtonProps) => <Button {...props} className={clsx(styles.iconButton, props.className)} />;
