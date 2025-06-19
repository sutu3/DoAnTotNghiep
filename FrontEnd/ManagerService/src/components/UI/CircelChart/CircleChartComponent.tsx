import React from "react";
import {ResponsiveContainer, PieChart, Pie, Tooltip, Cell} from "recharts";
import CustomChartTooltip from "./CustomChartTooltip"; // Adjust path

type ChartData = {
    name: string;
    [key: string]: string | number;
};

interface CircleChartComponentProps {
    chartData: ChartData[];
    categories: string[];
    color: string;
}

const CircleChartComponent: React.FC<CircleChartComponentProps> = ({ chartData, categories, color }) => {
    return (
        <ResponsiveContainer
            className="[&_.recharts-surface]:outline-none"
            height={200}
            width="100%"
        >
            <PieChart accessibilityLayer margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                {/* Use the custom tooltip component */}
                <Tooltip
                    content={<CustomChartTooltip categories={categories} color={color} />}
                    cursor={false}
                />
                <Pie
                    animationDuration={1000}
                    animationEasing="ease"
                    data={chartData}
                    dataKey="value"
                    innerRadius="68%"
                    nameKey="name"
                    paddingAngle={-20}
                    strokeWidth={0}
                >
                    {chartData.map((_, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={`hsl(var(--heroui-${color}-${(index + 1) * 200}))`}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CircleChartComponent;