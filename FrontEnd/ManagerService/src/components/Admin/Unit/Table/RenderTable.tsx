import {
    Tooltip,
} from "@heroui/react";

import {
    DeleteIcon,
    Droplet,
    EditIcon,
    EyeIcon,
    PackageCheck,
    Ruler,
    Weight,
} from "lucide-react";

import { GroupUnit } from "@/Store/GroupUnit.tsx";
import React from "react";

// Icon Map cho unitType
const unitTypeIconMap: Record<string, JSX.Element> = {
    Quantity: <PackageCheck className="w-4 h-4 text-success" />,
    Length: <Ruler className="w-4 h-4 text-primary" />,
    Volume: <Droplet className="w-4 h-4 text-blue-500" />,
    Weight: <Weight className="w-4 h-4 text-warning" />,
};

export interface Props {
    item: GroupUnit;
    columnKey: string;
    groupUnitID: string;
    open: boolean;
    setEvent: (key: string) => void;
    setOpen: (open: boolean) => void;
    handleDetail: (name: string) => void;
}

const RenderCell: React.FC<Props> = ({
                                         item,
                                         columnKey,
                                         groupUnitID,
                                         open,
                                         setEvent,
                                         setOpen,
                                         handleDetail
                                     }) => {

    const cellValue = item[columnKey as keyof GroupUnit];

    switch (columnKey) {
        case "unitType":
            return (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white">
                    {unitTypeIconMap[String(cellValue)] ?? <span className="text-default-400">•</span>}
                    <span>{cellValue ?? "N/A"}</span>
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
                    <Tooltip content="Details">
            <span
                onClick={() => {
                    handleDetail(item.groupName)
                }}
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
            >
              <EyeIcon />
            </span>
                    </Tooltip>
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
          {cellValue}
        </span>
            );
    }
};

export default RenderCell;
