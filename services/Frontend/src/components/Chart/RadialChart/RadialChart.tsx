"use client";

import { Cell, Pie, PieChart as BasePieChart, ResponsiveContainer } from "recharts";

import styles from "./styles/RadialChart.module.scss";

import { ChartContainer } from "@/components/Chart/ChartContainer/ChartContainer.tsx";
import { ChartProps } from "@/components/Chart/types/Chart";
import { getGlowFilter } from "@/components/Chart/utills/getGlowFilter.ts";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { Color } from "@/types/Color";
import { addOpacityToColor } from "@/utils/colorUtils.ts";

const DEFAULT_WIDTH = 5;
const DEFAULT_OUTER_RADIUS = 140;
const EXTRA_SAFE_VERTICAL_SPACE = 70;

const DEFAULT_ACTIVE_COLOR = "#8884d8";
const DEFAULT_BASE_COLOR_OPACITY = 0.25;
const DEFAULT_CORNER_RADIUS = 2;
const DEFAULT_GLOW_OPACITY = 0.5;

const MIDDLE_LEFT_ANGLE = 180;
const MIDDLE_RIGHT_ANGLE = 0;

type RadialChartProps = Omit<
    ChartProps<
        {
            outerRadius?: number;
            width?: number;
            cornerRadius?: number;
            activeColor?: Color;
        },
        number | null
    >,
    "chartColor" | "chartOpacityStart" | "chartOpacityStop"
>;

export const RadialChart = ({
    data,
    title,
    description,
    width = DEFAULT_WIDTH,
    outerRadius = DEFAULT_OUTER_RADIUS,
    activeColor = DEFAULT_ACTIVE_COLOR,
    cornerRadius = DEFAULT_CORNER_RADIUS,
}: RadialChartProps) => {
    const t = useTranslate();

    const innerRadius = outerRadius - width;
    const glowColor = addOpacityToColor(activeColor, DEFAULT_GLOW_OPACITY);
    const baseColor = addOpacityToColor(activeColor, DEFAULT_BASE_COLOR_OPACITY);
    const chartHeight = outerRadius + EXTRA_SAFE_VERTICAL_SPACE;

    const isValueAvailable = data !== null;
    const clampedValue = isValueAvailable ? Math.min(100, Math.max(0, data)) : null;

    const chartData = [
        { name: "value", value: clampedValue, fill: activeColor },
        {
            name: "remainder",
            value: 100 - (clampedValue ?? 0),
            fill: baseColor,
        },
    ];

    return (
        <ChartContainer height={chartHeight} title={title} description={description}>
            <ResponsiveContainer>
                <BasePieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="100%"
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                        startAngle={MIDDLE_LEFT_ANGLE}
                        endAngle={MIDDLE_RIGHT_ANGLE}
                        cornerRadius={cornerRadius}
                        stroke="none"
                    >
                        {chartData.map((entry) => (
                            <Cell
                                key={`cell-${entry.name}`}
                                fill={entry.fill}
                                style={
                                    entry.name === "value"
                                        ? {
                                              filter: getGlowFilter(glowColor),
                                          }
                                        : undefined
                                }
                            />
                        ))}
                    </Pie>
                </BasePieChart>
            </ResponsiveContainer>

            <div className={styles.valueContainer}>
                <p className={styles.value}>{isValueAvailable ? `${clampedValue?.toFixed(0)}%` : t("common.valueUnavailable.label")}</p>
            </div>
        </ChartContainer>
    );
};
