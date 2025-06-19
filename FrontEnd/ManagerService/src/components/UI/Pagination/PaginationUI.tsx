import { cn, Pagination, PaginationItemType } from "@heroui/react";
import { ChevronIcon } from "@/components/UI/Icon/ChevronIconUI.tsx";

interface CustomPaginationProps {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
}

export default function CustomPagination({ page, setPage, totalPages }: CustomPaginationProps) {
    const renderItem = ({ ref, key, value, isActive, onNext, onPrevious, className }) => {
        if (value === PaginationItemType.NEXT) {
            return (
                <button
                    key={key}
                    className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
                    onClick={onNext}
                >
                    <ChevronIcon className="rotate-180" />
                </button>
            );
        }

        if (value === PaginationItemType.PREV) {
            return (
                <button
                    key={key}
                    className={cn(className, "bg-default-200/50 min-w-8 w-8 h-8")}
                    onClick={onPrevious}
                >
                    <ChevronIcon />
                </button>
            );
        }

        if (value === PaginationItemType.DOTS) {
            return (
                <button key={key} className={className}>
                    ...
                </button>
            );
        }

        return (
            <button
                key={key}
                ref={ref}
                className={cn(
                    className,
                    isActive && "text-white bg-gradient-to-br from-indigo-500 to-pink-500 font-bold"
                )}
                onClick={() => setPage(value)}
            >
                {value}
            </button>
        );
    };

    return (
        <Pagination
            disableCursorAnimation
            showControls
            className="gap-2 mt-10"
            page={page}
            total={totalPages}
            radius="full"
            renderItem={renderItem}
            variant="light"
            onChange={setPage}
        />
    );
}