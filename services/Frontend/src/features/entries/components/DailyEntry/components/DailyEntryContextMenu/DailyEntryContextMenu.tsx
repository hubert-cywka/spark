import {PropsWithChildren} from "react";

import {Popover} from "@/components/Popover";

type DailyEntryContextMenuProps = PropsWithChildren;

export const DailyEntryContextMenu = ({ children }: DailyEntryContextMenuProps) => {
    return (
        <Popover offset={15} trigger={children}>

        </Popover>
);
};