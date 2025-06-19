import { Button, Card, Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
export type CardStatProps = {
    title: string;
    value: string | number;
    change: string;
    changeType: "positive" | "neutral" | "negative";
    iconName: string;
    trendChipPosition?: "top" | "bottom";
    actionLabel?: string;
    onActionClick?: () => void;
};

type CardUIProps = {
    data: CardStatProps[];
};

export default function CardUI({ data }: CardUIProps) {
    return (
        <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            {data.map((item, index) => {
                const {
                    title,
                    value,
                    change,
                    changeType,
                    iconName,
                    trendChipPosition = "top",
                    actionLabel = "View All",
                    onActionClick,
                } = item;

                return (
                    <Card
                        key={index}
                        className="relative border border-transparent dark:border-default-100"
                    >
                        <div className="flex p-4">
                            {/* Icon Container */}
                            <div
                                className={cn("mt-1 flex h-8 w-8 items-center justify-center rounded-md", {
                                    "bg-success-50": changeType === "positive",
                                    "bg-warning-50": changeType === "neutral",
                                    "bg-danger-50": changeType === "negative",
                                })}
                            >
                                <Icon
                                    className={cn({
                                        "text-success": changeType === "positive",
                                        "text-warning": changeType === "neutral",
                                        "text-danger": changeType === "negative",
                                    })}
                                    icon={iconName}
                                    width={20}
                                />
                            </div>

                            {/* Title & Value */}
                            <div className="flex flex-col gap-y-2">
                                <dt className="mx-4 text-small font-medium text-default-500">{title}</dt>
                                <dd className="px-4 text-2xl font-semibold text-default-700">{value}</dd>
                            </div>

                            {/* Chip */}
                            <Chip
                                className={cn("absolute right-4", {
                                    "top-4": trendChipPosition === "top",
                                    "bottom-4": trendChipPosition === "bottom",
                                })}
                                classNames={{
                                    content: "font-semibold text-[0.65rem]",
                                }}
                                color={
                                    changeType === "positive"
                                        ? "success"
                                        : changeType === "neutral"
                                            ? "warning"
                                            : "danger"
                                }
                                radius="sm"
                                size="sm"
                                startContent={
                                    <Icon
                                        height={12}
                                        width={12}
                                        icon={
                                            changeType === "positive"
                                                ? "solar:arrow-right-up-linear"
                                                : changeType === "neutral"
                                                    ? "solar:arrow-right-linear"
                                                    : "solar:arrow-right-down-linear"
                                        }
                                    />
                                }
                                variant="flat"
                            >
                                {change}
                            </Chip>
                        </div>

                        {/* Footer Button */}
                        <div className="bg-default-100">
                            <Button
                                fullWidth
                                className="flex justify-start text-xs text-default-500 data-[pressed]:scale-100"
                                radius="none"
                                variant="light"
                                onClick={onActionClick}
                            >
                                {actionLabel}
                            </Button>
                        </div>
                    </Card>
                );
            })}
        </dl>
    );
}
