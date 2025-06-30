
import React from "react";
import {Category} from "@/Store/CategorySlice.tsx";



export interface Props {
    item: Category;
    columnKey: string;

}

const RenderCell: React.FC<Props> = ({
                                         item,
                                         columnKey
                                     }) => {
    const cellValue = item[columnKey as keyof Category];

    switch (columnKey) {
        case "createdAt":
            return (
                <div className="inline-flex flex-col text-start leading-tight">
                    <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "N/A"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.createdAt
                            ? new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : ""}
                    </span>
                </div>
            );
        case "warehouseName":
            return <span className={"text-blue-400"}>{item?.warehouses?.warehouseName ?? "N/A"}</span>;
        case "createByUser":
            return (
                <span className="text-blue-400">
                    {item?.createByUser?.userName ?? "N/A"}
                </span>
            );

        default:
            return (
                <span className="text-gray-800 dark:text-white">
                    {cellValue ?? "N/A"}
                </span>
            );
    }
};

export default RenderCell;
