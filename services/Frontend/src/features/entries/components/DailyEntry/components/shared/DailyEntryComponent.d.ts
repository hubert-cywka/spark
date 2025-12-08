import {DailyEntryColumn} from "@/features/daily/components/DailyList/hooks/useNavigateBetweenEntries.ts";

export type DailyEntryComponentProps = {
    column: DailyEntryColumn;
} & DailyEntryNavigationOptions;

export type DailyEntryNavigationOptions = {
    onNavigateRight?: () => void;
    onNavigateLeft?: () => void;
    onNavigateDown?: () => void;
    onNavigateUp?: () => void;
}