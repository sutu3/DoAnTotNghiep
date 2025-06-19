
import React from "react";
import { TooltipProps } from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import {formatTotal} from "@/Utils/FormatTotal.ts";

interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
    categories: string[];
    color: string; // Pass color here to apply styles
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, categories, color }) => {
    if (active && payload && payload.length) {
        const dataPoint = payload[0]; // Assuming single data point per slice
        const name = dataPoint.name as string; // Slice name
        const value = dataPoint.value as number; // Slice value
        const category = categories.find((c) => c.toLowerCase() === name?.toLowerCase()) ?? name; // Match name to category

        // Determine color for the bullet point - requires index from Cell or re-lookup
        // For simplicity here, we might hardcode or infer based on category index or use a simpler approach
        // Recharts payload might not easily give the original data index required for the color mapping (index+1 * 200)
        // A better approach would be to pass color mapping or let recharts handle it if possible,
        // or calculate based on which category matches (assuming stable category order).
        // Let's simulate finding the color index based on the categories order
        const colorIndex = categories.findIndex(c => c.toLowerCase() === name?.toLowerCase());
        const bgColorStyle = {
            backgroundColor: colorIndex !== -1
                ? `hsl(var(--heroui-${color}-${(colorIndex + 1) * 200}))`
                : 'gray', // Fallback color
        };


        return (
            <div className="flex h-8 min-w-[120px] items-center gap-x-2 rounded-medium bg-background px-1 text-tiny shadow-small">
                {/* Bullet color */}
                <div className="h-2 w-2 flex-none rounded-full" style={bgColorStyle} />

                <div className="flex w-full items-center justify-between gap-x-2 pr-1 text-xs text-default-700">
                    <span className="text-default-500">{category}</span>
                    <span className="font-mono font-medium text-default-700">
                        {formatTotal(value)}
                    </span>
                </div>
            </div>
        );
    }

    return null;
};

export default CustomChartTooltip;