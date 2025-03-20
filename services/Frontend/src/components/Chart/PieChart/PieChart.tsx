"use client";

import { useMemo } from "react";
import { Pie, PieChart as BasePieChart, ResponsiveContainer } from "recharts";

import { ChartContainer } from "@/components/Chart/ChartContainer/ChartContainer.tsx";
import { ChartProps } from "@/components/Chart/types/Chart";

type RadialChartProps = ChartProps<{
    innerRadius?: number;
    outerRadius?: number;
}>;

const generateColor = (index: number, total: number) => {
    const hue = (index / total) * 120 + 200;
    return `hsla(${hue}, 30%, 50%, 50%)`;
};

export const PieChart = ({ data, title, outerRadius = 125, innerRadius = 50 }: RadialChartProps) => {
    const colors = useMemo(() => data.map((_, i) => generateColor(i, data.length)), [data]);
    const heightWithPadding = outerRadius * 2 + 100;

    return (
        <ChartContainer height={heightWithPadding} title={title}>
            <ResponsiveContainer width="100%" height="100%">
                <BasePieChart width={heightWithPadding} height={heightWithPadding}>
                    <defs>
                        {colors.map((color, i) => (
                            <linearGradient key={i} id={`colorValue${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="20%" stopColor={color} stopOpacity={1} />
                                <stop offset="95%" stopColor={color} stopOpacity={0.5} />
                            </linearGradient>
                        ))}
                    </defs>

                    <Pie
                        data={data.map((data, i) => ({
                            ...data,
                            fill: `url(#colorValue${i})`,
                        }))}
                        stroke="#ffffff33"
                        dataKey="value"
                        nameKey="key"
                        cx="50%"
                        cy="50%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        label={({ key, value }) => `${key}: ${value}`}
                    />
                </BasePieChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
