"use client";

import { Area } from "recharts";

import { CartesianChart } from "@/components/Chart/CartesianChart/CartesianChart.tsx";
import { CartesianChartProps } from "@/components/Chart/types/Chart";

export const AreaChart = (props: CartesianChartProps) => {
    return (
        <CartesianChart {...props}>
            {({ solidColor, gradientColor, dataKey }) => (
                <Area type="monotone" dataKey={dataKey} stroke={solidColor} fill={gradientColor} />
            )}
        </CartesianChart>
    );
};
