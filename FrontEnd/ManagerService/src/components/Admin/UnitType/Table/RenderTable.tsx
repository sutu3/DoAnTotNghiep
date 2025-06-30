import {
    Tooltip,
} from "@heroui/react";

import {
    DeleteIcon,
    EditIcon,
    EyeIcon,

} from "lucide-react";

import React from "react";
import { Unit } from "@/Store/Unit.tsx";



export interface Props {
    item: Unit;
    columnKey: string;
    unitID: string;
    open: boolean;
    setEvent: (key: string) => void;
    setOpen: (open: boolean) => void;
    handleDetail: (name: string) => void;
}

const RenderCell: React.FC<Props> = ({
                                         item,
                                         columnKey,
                                         unitID,
                                         open,
                                         setEvent,
                                         setOpen,
                                         handleDetail
                                     }) => {
    const cellValue = item[columnKey as keyof Unit];

    switch (columnKey) {
        case "unitName":
        case "shortName":
        case "ratioToBase":
        case "isDefault":
            return (
                <span className="text-gray-800 dark:text-white">
                    {String(cellValue)}
                </span>
            );

        case "groupUnit":
            return (
                <div className="flex flex-col text-sm">
                    <span className="text-gray-800 dark:text-white">
                        {item.groupUnit?.groupName ?? "N/A"}
                    </span>
                </div>
            );

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

        case "createByUser":
            return (
                <span className="text-blue-400">
                    {item?.createByUser?.userName ?? "N/A"}
                </span>
            );

        case "action":
            return (
                <div className="relative flex items-center gap-2">

                    <Tooltip content="Edit">
                        <span
                            onClick={() => {
                                setOpen(!open);
                                setEvent("Edit");
                            }}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        >
                            <EditIcon />
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete">
                        <span
                            onClick={() => {
                                setOpen(!open);
                                setEvent("Delete");
                            }}
                            className="text-lg text-danger cursor-pointer active:opacity-50"
                        >
                            <DeleteIcon />
                        </span>
                    </Tooltip>
                </div>
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
