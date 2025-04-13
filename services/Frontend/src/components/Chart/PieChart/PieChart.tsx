"use client";

import { useMemo } from "react";
import { Pie, PieChart as BasePieChart, ResponsiveContainer } from "recharts";

import { ChartContainer } from "@/components/Chart/ChartContainer/ChartContainer.tsx";
import { ChartProps } from "@/components/Chart/types/Chart";

const DEFAULT_OUTER_RADIUS = 125;
const DEFAULT_INNER_RADIUS = 50;
const LABELS_PADDING = 150;

const DEFAULT_HUE_OFFSET = 200;
const DEFAULT_HUE_MULTIPLIER = 120;

const DEFAULT_STROKE_COLOR = "#ffffff33";
const DEFAULT_DEFAULT_CHART_OPACITY_START = 0.75;
const DEFAULT_DEFAULT_CHART_OPACITY_STOP = 0.5;

type PieChartProps = ChartProps<{
    innerRadius?: number;
    outerRadius?: number;
    withPercentage?: boolean;
}>;

export const PieChart = ({
    data,
    title,
    withPercentage = false,
    outerRadius = DEFAULT_OUTER_RADIUS,
    innerRadius = DEFAULT_INNER_RADIUS,
    chartOpacityStop = DEFAULT_DEFAULT_CHART_OPACITY_STOP,
    chartOpacityStart = DEFAULT_DEFAULT_CHART_OPACITY_START,
}: PieChartProps) => {
    const colors = useMemo(() => data.map((_, i) => generateColor(i, data.length)), [data]);
    const heightWithPadding = outerRadius * 2 + LABELS_PADDING;

    return (
        <ChartContainer height={heightWithPadding} title={title}>
            <ResponsiveContainer width="100%" height="100%">
                <BasePieChart width={heightWithPadding} height={heightWithPadding}>
                    <defs>
                        {colors.map((color, i) => (
                            <linearGradient key={i} id={`colorValue${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={color} stopOpacity={chartOpacityStart} />
                                <stop offset="95%" stopColor={color} stopOpacity={chartOpacityStop} />
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={data.map((data, i) => ({
                            ...data,
                            fill: `url(#colorValue${i})`,
                        }))}
                        stroke={DEFAULT_STROKE_COLOR}
                        dataKey="value"
                        nameKey="key"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        label={({ key, value }) => `${key}: ${value}${withPercentage ? "%" : ""}`}
                    />
                </BasePieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};

// TODO: Generate color based on chart color
const generateColor = (index: number, total: number) => {
    const hue = (index / total) * DEFAULT_HUE_MULTIPLIER + DEFAULT_HUE_OFFSET;
    return `hsla(${hue}, 30%, 50%)`;
};
