
import React from "react";
import type {ButtonProps} from "@heroui/react";

interface ChartLegendProps {
    categories: string[];
    color: ButtonProps["color"];
}

const ChartLegend: React.FC<ChartLegendProps> = ({ categories, color }) => {
    return (
        <div className="flex w-full flex-col justify-center gap-4 p-4 text-tiny text-default-500 lg:p-0">
            {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{
                            backgroundColor: `hsl(var(--heroui-${color}-${(index + 1) * 200}))`,
                        }}
                    />
                    <span className="capitalize">{category}</span>
                </div>
            ))}
        </div>
    );
};

export default ChartLegend;