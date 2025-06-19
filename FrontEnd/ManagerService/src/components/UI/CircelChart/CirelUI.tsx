import React from "react";
import type {ButtonProps, CardProps} from "@heroui/react";
import {  Card,
    Button,
    Select,
    SelectItem,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    cn,
} from "@heroui/react";
import {Icon} from "@iconify/react";
import CircleChartComponent from "./CircleChartComponent"; // Adjust path
import ChartLegend from "./ChartLegend"; // Adjust path

type ChartData = {
    name: string;
    [key: string]: string | number;
};

interface CircleChartCardProps extends Omit<CardProps, "children"> {
    title: string;
    color: ButtonProps["color"];
    categories: string[];
    chartData: ChartData[];
}

const CircleChartCard = React.forwardRef<
    HTMLDivElement,
    CircleChartCardProps
>(({className, title, categories, color, chartData, ...props}, ref) => {
    return (
        <Card
            ref={ref}
            className={cn("min-h-[240px] border border-transparent dark:border-default-100", className)}
            {...props}
        >
            <div className="flex flex-col gap-y-2 p-4 pb-0">
                <div className="flex items-center justify-between gap-x-2">
                    <dt>
                        <h3 className="text-small font-medium text-default-500">{title}</h3>
                    </dt>
                    <div className="flex items-center justify-end gap-x-2">
                        <Select
                            aria-label="Time Range"
                            classNames={{
                                trigger: "min-w-[100px] min-h-7 h-7",
                                value: "text-tiny !text-default-500",
                                selectorIcon: "text-default-500",
                                popoverContent: "min-w-[120px]",
                            }}
                            defaultSelectedKeys={["per-day"]}
                            listboxProps={{
                                itemClasses: {
                                    title: "text-tiny",
                                },
                            }}
                            placeholder="Per Day"
                            size="sm"
                        >
                            <SelectItem key="per-day">Per Day</SelectItem>
                            <SelectItem key="per-week">Per Week</SelectItem>
                            <SelectItem key="per-month">Per Month</SelectItem>
                        </Select>
                        <Dropdown
                            classNames={{
                                content: "min-w-[120px]",
                            }}
                            placement="bottom-end"
                        >
                            <DropdownTrigger>
                                <Button isIconOnly radius="full" size="sm" variant="light">
                                    <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                itemClasses={{
                                    title: "text-tiny",
                                }}
                                variant="flat"
                            >
                                <DropdownItem key="view-details">View Details</DropdownItem>
                                <DropdownItem key="export-data">Export Data</DropdownItem>
                                <DropdownItem key="set-alert">Set Alert</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {/* This div contains both the chart component and the legend component */}
            <div className="flex h-full flex-wrap items-center justify-center gap-x-2 lg:flex-nowrap">
                {/* Pass data and props to the chart component */}
                <CircleChartComponent
                    chartData={chartData}
                    categories={categories}
                    color={color}
                />

                {/* Pass data and props to the legend component */}
                <ChartLegend categories={categories} color={color} />
            </div>
        </Card>
    );
});

CircleChartCard.displayName = "CircleChartCard";

export default CircleChartCard;