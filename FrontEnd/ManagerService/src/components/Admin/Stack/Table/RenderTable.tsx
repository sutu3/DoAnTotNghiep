import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Progress, Tooltip, User,} from "@heroui/react";

import {DeleteIcon, EditIcon} from "lucide-react";

import React from "react";
import {VerticalDotsIcon} from "@/components/UI/Table/IconTable.tsx";
import {Product} from "@/Store/ProductSlice.tsx";
import {formatVND} from "@/Utils/FormatVND.tsx";
import {StackType} from "@/Store/StackSlice.tsx";


export interface Props {
    item: StackType;
    columnKey: string;
    handleDelete: (name: string) => void;
    handleDetail: (name: string) => void;
}

const RenderCell: React.FC<Props> = ({
                                         item,
                                         columnKey,
                                         handleDelete,
                                         handleDetail
                                     }) => {

    const cellValue = item[columnKey as keyof StackType];

    switch (columnKey) {

        case "createdAt":
            return (
                <div className="inline-flex flex-col text-start leading-tight">
      <span className="text-sm font-medium text-gray-800 dark:text-white">
        {item?.createdAt
            ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            : "N/A"}
      </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
        {item?.createdAt
            ? new Date(item.createdAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            })
            : ""}
      </span>
                </div>
            );
        case "description":
            return <Tooltip content={item?.description}>
                        <span className="text-md w-[150px] leading-snug line-clamp-3 overflow-hidden">
                            {item?.description}
                        </span>
            </Tooltip>;
        case "binCount":
            const totalBins = item.bin?.length; // Assuming total is always 12 based on the division logic
            const filledBins = item.bin?.filter((el)=>el.status=="EMPTY").length ?? 0;
            const percent = totalBins === 0 ? 0 : Math.round((filledBins / totalBins) * 100);

            return (
                <div className="w-full">
                    <div className="flex justify-between text-xs text-gray-800 dark:text-white mb-1">
            <span>
              {filledBins} / {totalBins}
            </span>
                        <span>{percent}%</span>
                    </div>
                    <Progress
                        color={percent > 50 ? "success" : "primary"}
                        radius="sm"
                        size="sm"
                        value={percent}
                    />
                </div>
            );
        case "warehouse":
            return <span className={"text-blue-400"}>{item?.warehouse?.warehouseName ?? "N/A"}</span>;
        case "action":
            return (
                <div className="relative flex items-center gap-2">

                    <Tooltip content="Edit">
                        <span onClick={()=>{
                            handleDetail(item.stackName)
                        }}  className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon/>
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                        <span onClick={()=>{
                            handleDelete(item.stackName)
                        }} className="text-lg text-danger cursor-pointer active:opacity-50">
                            <DeleteIcon/>
                        </span>
                    </Tooltip>
                </div>
            );
        case "actions":
            return (
                <div className="relative flex justify-end items-center gap-2">
                    <Dropdown className="text-gray-800 dark:text-white bg-background border-1 border-default-200">
                        <DropdownTrigger>
                            <Button isIconOnly radius="full" size="sm" variant="light">
                                <VerticalDotsIcon className="text-default-400"/>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem key="view">View</DropdownItem>
                            <DropdownItem key="edit">Edit</DropdownItem>
                            <DropdownItem key="delete">Delete</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            );

        default:
            return <span className={"text-gray-800 dark:text-white"}>{cellValue ?? "N/A"}</span>;
    }
};

export default RenderCell;