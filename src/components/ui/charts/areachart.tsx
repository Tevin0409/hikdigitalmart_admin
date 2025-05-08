"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface AreaChartComponentProps<T> {
    data: T[]
    dataKey: keyof T
    xAxisKey: keyof T
    config: ChartConfig
    colorVariable?: string
    className?: string
}

export function AreaChartComponent<T extends Record<string, any>>({
    data,
    dataKey,
    xAxisKey,
    config,
    colorVariable,
    className,
}: AreaChartComponentProps<T>) {
    const chartKey = String(dataKey)
    const xKey = String(xAxisKey)
    const chartColor = colorVariable ?? `var(--color-${chartKey})`
    return (
        <ChartContainer config={config} className={className ?? "w-full max-h-72 h-full"}>
            <AreaChart
                accessibilityLayer
                data={data}
                margin={{ left: 12, right: 12 }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey={xKey}
                    type="category"
                    scale="point"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => String(value)}
                // tick={{ fontSize: 12, angle: -20, textAnchor: 'end' }} // rotate if needed
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                    dataKey={chartKey}
                    type="natural"
                    fill={chartColor}
                    fillOpacity={0.4}
                    stroke={chartColor}
                />
            </AreaChart>
        </ChartContainer>
    )
}
