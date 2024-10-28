import clsx from "clsx";

import styles from "./styles/IconButton.module.scss";

import { Button } from "@/components/button/Button";
import { ButtonProps } from "@/components/button/types/Button";

export const IconButton = (props: ButtonProps) => <Button {...props} className={clsx(styles.iconButton, props.className)} />;
