import { Daily } from "@/features/daily/types/Daily";

type DayProps = {
    daily: Daily;
};

export const Day = ({ daily }: DayProps) => {
    return (
        <div>
            <h1>{daily.date}</h1>
            <ul>
                <li>Something something</li>
                <li>Something something something something</li>
                <li>Something something something</li>
                <li>Something</li>
                <li>Something something</li>
                <li>Something something something</li>
            </ul>
        </div>
    );
};
