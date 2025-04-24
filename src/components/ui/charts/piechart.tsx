"use client"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"

export interface PieChartCardProps<T extends Record<string, any>> {
    /** Title shown in the card header */
    title: string
    /** Optional subheading/description */
    description?: string
    /** Array of data points */
    data: T[]
    /** Key of T holding numeric values */
    dataKey: keyof T
    /** Key of T holding names/labels */
    nameKey: keyof T
    /** Configuration mapping chart fields to labels/colors */
    config: ChartConfig
    /** Inner radius of donut chart */
    innerRadius?: number
    /** Stroke width between slices */
    strokeWidth?: number
    /** Optional trend text (e.g., "Trending up by 5.2% this month") */
    trendText?: string
    /** Optional React node for trend icon */
    trendIcon?: React.ReactNode
    /** Optional footer descriptive text */
    footerText?: string
    /** Additional CSS classes for Card */
    className?: string
}

export function PieChartComponent<T extends Record<string, any>>({
    title,
    description,
    data,
    dataKey,
    nameKey,
    config,
    innerRadius = 60,
    strokeWidth = 5,
    trendText,
    trendIcon,
    footerText,
    className,
}: PieChartCardProps<T>) {
    const total = React.useMemo(() => {
        return data.reduce(
            (acc, curr) => acc + Number(curr[dataKey] ?? 0),
            0
        )
    }, [data, dataKey])

    return (
        <ChartContainer
            config={config}
            className="mx-auto aspect-square max-h-72 h-fullw-full"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Pie
                    data={data}
                    dataKey={String(dataKey)}
                    nameKey={String(nameKey)}
                    innerRadius={innerRadius}
                    strokeWidth={strokeWidth}
                >
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {total.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            {config[dataKey as string]?.label || String(dataKey)}
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>
        // <ChartContainer
        //     config={chartConfig}
        //     className="mx-auto aspect-square w-fit max-h-72 h-full"
        // >
        //     <PieChart>
        //         <ChartTooltip
        //             cursor={false}
        //             content={<ChartTooltipContent hideLabel />}
        //         />
        //         <ChartLegend content={<ChartLegendContent />} />
        //         <Pie
        //             data={chartData}
        //             dataKey="visitors"
        //             nameKey="browser"
        //             innerRadius={60}
        //             strokeWidth={5}
        //         >
        //             <Label
        //                 content={({ viewBox }) => {
        //                     if (viewBox && "cx" in viewBox && "cy" in viewBox) {
        //                         return (
        //                             <text
        //                                 x={viewBox.cx}
        //                                 y={viewBox.cy}
        //                                 textAnchor="middle"
        //                                 dominantBaseline="middle"
        //                             >
        //                                 <tspan
        //                                     x={viewBox.cx}
        //                                     y={viewBox.cy}
        //                                     className="fill-foreground text-3xl font-bold"
        //                                 >
        //                                     {totalVisitors.toLocaleString()}
        //                                 </tspan>
        //                                 <tspan
        //                                     x={viewBox.cx}
        //                                     y={(viewBox.cy || 0) + 24}
        //                                     className="fill-muted-foreground"
        //                                 >
        //                                     Visitors
        //                                 </tspan>
        //                             </text>
        //                         )
        //                     }
        //                 }}
        //             />
        //         </Pie>
        //     </PieChart>
        // </ChartContainer>
    )
}