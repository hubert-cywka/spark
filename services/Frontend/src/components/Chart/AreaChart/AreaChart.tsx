"use client";

import { Area } from "recharts";

import { CartesianChart } from "@/components/Chart/CartesianChart/CartesianChart.tsx";
import { CartesianChartProps } from "@/components/Chart/types/Chart";
import { getGlowFilter } from "@/components/Chart/utills/getGlowFilter.ts";
import { addOpacityToColor } from "@/utils/colorUtils.ts";

const DEFAULT_GLOW_OPACITY = 0.5;
const DEFAULT_STROKE_WIDTH = 2;

export const AreaChart = (props: CartesianChartProps) => {
    return (
        <CartesianChart {...props}>
            {({ solidColor, gradientColor, dataKey }) => {
                const finalGlowColor = addOpacityToColor(solidColor, DEFAULT_GLOW_OPACITY);

                return (
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={solidColor}
                        strokeWidth={DEFAULT_STROKE_WIDTH}
                        fill={gradientColor}
                        style={{
                            filter: getGlowFilter(finalGlowColor),
                        }}
                    />
                );
            }}
        </CartesianChart>
    );
};
