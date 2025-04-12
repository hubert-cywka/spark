export type ChartData = { key: string; value: number }[];

export type ChartProps<T, TData = ChartData> = {
    data: TData;
    title: string;
    description?: string;
    chartColor?: `#${string}`;
    chartOpacityStart?: number;
    chartOpacityStop?: number;
} & T;

export type CartesianChartProps<T = object> = ChartProps<T> & {
    keyLabel: string;
    height?: number;
    minTickGap?: number;
    gridOpacity?: number;
    xLabel?: string;
    yLabel?: string;
};
