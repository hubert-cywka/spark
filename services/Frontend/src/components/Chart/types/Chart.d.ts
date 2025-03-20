export type ChartProps<T> = {
    data: { key: string; value: number }[];
    title?: string;
    color?: string;
} & T;

export type CartesianChartProps<T = object> = ChartProps<T> & {
    keyLabel: string;
    height?: number;
    color?: string;
    minTickGap?: number;
};
