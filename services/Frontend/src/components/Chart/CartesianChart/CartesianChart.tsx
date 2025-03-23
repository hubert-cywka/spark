import { ReactNode } from "react";
import { CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import styles from "./styles/CartesianChart.module.scss";

import { ChartContainer } from "@/components/Chart/ChartContainer/ChartContainer.tsx";
import { CartesianChartProps } from "@/components/Chart/types/Chart";

const DEFAULT_HEIGHT = 300;
const DEFAULT_TICKS_GAP = 30;
const X_AXIS_LABEL_OFFSET = 20;
const Y_AXIS_LABEL_OFFSET_PER_CHARACTER = 4;

const DEFAULT_COLOR = "#8884d8";
const DEFAULT_DEFAULT_CHART_OPACITY_START = 0.75;
const DEFAULT_DEFAULT_CHART_OPACITY_STOP = 0;
const DEFAULT_GRID_OPACITY = 0.05;

type CartesianChartPropsWithChildren = CartesianChartProps<{
    children: (p: { solidColor: string; gradientColor: string; semiTransparentColor: string; dataKey: string }) => ReactNode;
}>;

export const CartesianChart = ({
    title,
    data,
    keyLabel,
    height = DEFAULT_HEIGHT,
    minTickGap = DEFAULT_TICKS_GAP,
    chartColor = DEFAULT_COLOR,
    chartOpacityStart = DEFAULT_DEFAULT_CHART_OPACITY_START,
    chartOpacityStop = DEFAULT_DEFAULT_CHART_OPACITY_STOP,
    gridOpacity = DEFAULT_GRID_OPACITY,
    children,
    xLabel,
    yLabel,
}: CartesianChartPropsWithChildren) => {
    return (
        <ChartContainer height={height} title={title}>
            <ResponsiveContainer>
                <ComposedChart data={data} margin={{ bottom: xLabel ? X_AXIS_LABEL_OFFSET : 0 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="20%" stopColor={chartColor} stopOpacity={chartOpacityStart} />
                            <stop offset="99%" stopColor={chartColor} stopOpacity={chartOpacityStop} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid opacity={gridOpacity} />

                    <YAxis
                        label={{
                            fill: chartColor,
                            value: yLabel,
                            angle: -90,
                            position: "insideLeft",
                            dy: (yLabel?.length ?? 0) * Y_AXIS_LABEL_OFFSET_PER_CHARACTER,
                        }}
                    />
                    <XAxis
                        label={{
                            fill: chartColor,
                            value: xLabel,
                            position: "insideBottom",
                            dy: X_AXIS_LABEL_OFFSET,
                        }}
                        minTickGap={minTickGap}
                        dataKey="key"
                    />
                    <Tooltip formatter={(value) => [value, keyLabel]} wrapperClassName={styles.tooltipLabel} />

                    {children({
                        semiTransparentColor: chartColor + "99",
                        solidColor: chartColor,
                        gradientColor: "url(#colorValue)",
                        dataKey: "value",
                    })}
                </ComposedChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
