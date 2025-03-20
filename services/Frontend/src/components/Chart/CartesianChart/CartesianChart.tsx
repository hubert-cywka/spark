import { ReactNode } from "react";
import { CartesianGrid, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import styles from "./styles/CartesianChart.module.scss";

import { ChartContainer } from "@/components/Chart/ChartContainer/ChartContainer.tsx";
import { CartesianChartProps } from "@/components/Chart/types/Chart";

type CartesianChartPropsWithChildren = CartesianChartProps<{
    children: (p: { solidColor: string; gradientColor: string; dataKey: string }) => ReactNode;
}>;

export const CartesianChart = ({
    title,
    data,
    keyLabel,
    height = 300,
    minTickGap = 30,
    color = "#8884d8",
    children,
}: CartesianChartPropsWithChildren) => {
    return (
        <ChartContainer height={height} title={title}>
            <ResponsiveContainer>
                <ComposedChart data={data} margin={{ right: 50 }}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="20%" stopColor={color} stopOpacity={0.33} />
                            <stop offset="99%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid opacity={0.05} />

                    <YAxis />
                    <XAxis dataKey="key" minTickGap={minTickGap} />
                    <Tooltip formatter={(value) => [value, keyLabel]} wrapperClassName={styles.tooltipLabel} />

                    {children({
                        solidColor: color,
                        gradientColor: "url(#colorValue)",
                        dataKey: "value",
                    })}
                </ComposedChart>
            </ResponsiveContainer>
        </ChartContainer>
    );
};
