import { useState } from "react";
import { Key, Label, ListBox, ListBoxItem, Select, SelectValue } from "react-aria-components";
import { ChevronDownIcon } from "lucide-react";

import styles from "./styles/Dropdown.module.scss";

import { Button } from "@/components/Button";
import { DropdownProps, OnSelectionChange } from "@/components/Dropdown/types/Dropdown";
import { Icon } from "@/components/Icon";
import { Popover } from "@/components/Popover";

export function Dropdown<T extends Key>({ selectedKey, items, label, onChange, placeholder, size = "2" }: DropdownProps<T>) {
    const [open, setOpen] = useState(false);

    const internalOnChange = (key: T) => {
        setOpen(false);
        onChange(key);
    };

    return (
        <Select
            isOpen={open}
            onOpenChange={setOpen}
            onSelectionChange={internalOnChange as OnSelectionChange}
            selectedKey={selectedKey}
            className={styles.container}
            placeholder={placeholder}
        >
            <Label className={styles.label}>{label}</Label>

            <Popover
                isOpen={open}
                onOpenChange={setOpen}
                trigger={
                    <Button
                        size={size}
                        variant="secondary"
                        rightDecorator={<Icon slot={ChevronDownIcon} size="1" />}
                        className={styles.button}
                    >
                        <SelectValue className={styles.value} />
                    </Button>
                }
            >
                <ListBox items={items} className={styles.items}>
                    {items.map(({ label, key }) => (
                        <ListBoxItem id={key} key={key} className={styles.item}>
                            {label}
                        </ListBoxItem>
                    ))}
                </ListBox>
            </Popover>
        </Select>
    );
}
