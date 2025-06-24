import { Key } from "react-aria-components";

export type DropdownProps<T extends Key> = {
    selectedKey?: T | null;
    items: DropdownItem<T>[];
    onChange: OnSelectionChange<T>;
    label: string;
    placeholder?: string;
    size?: DropdownSize;
};

type DropdownSize = "1" | "2" | "3";

export type OnSelectionChange<T = Key> = (key: T) => void;

type DropdownItem<T> = {
    label: string;
    key: T;
};
