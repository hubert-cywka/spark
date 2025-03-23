"use client";

import { Bar } from "recharts";

import { CartesianChart } from "@/components/Chart/CartesianChart/CartesianChart.tsx";
import { CartesianChartProps } from "@/components/Chart/types/Chart";

export const BarChart = (props: CartesianChartProps) => {
    return (
        <CartesianChart {...props}>
            {({ semiTransparentColor, dataKey }) => <Bar dataKey={dataKey} fill={semiTransparentColor} />}
        </CartesianChart>
    );
};
