import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip, User,} from "@heroui/react";

import {DeleteIcon, EditIcon} from "lucide-react";

import React from "react";
import {VerticalDotsIcon} from "@/components/UI/Table/IconTable.tsx";
import {Product} from "@/Store/ProductSlice.tsx";
import {formatVND} from "@/Utils/FormatVND.tsx";


export interface Props {
    item: Product;
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

    const cellValue = item[columnKey as keyof Product];

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
                        <span className="text-md w-[50px] leading-snug line-clamp-3 overflow-hidden">
                            {item?.description}
                        </span>
            </Tooltip>;
        case "price":
            return <span>{cellValue ? formatVND(Number(cellValue)) : formatVND(0)}</span>;
        case "createByUser": // Consolidated the duplicate warehouseName case
            return <span className="text-blue-400">{item?.createByUser?.userName ?? "N/A"}</span>;
        case "supplier":
            return <span className={""}>{item?.supplier?.supplierName ?? "N/A"}</span>;
        case "category":
            return <span className={""}>{item?.category?.categoryName ?? "N/A"}</span>;
        case "unit":
            return <span className={""}>{item?.unit?.unitName ?? "N/A"}</span>;
        case "isActive":
            return (
                <span
                    className={`px-2 py-1 text-sm font-medium rounded-full ${
                        item?.isActive ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                    }`}
                >
                    {item?.isActive ? "Active" : "IsActive"}
                </span>
            );

        case "warehouse":
            return <span className={"text-blue-400"}>{item?.warehouses?.warehouseName ?? "N/A"}</span>;
        case "productName":
            return (
                <User
                    avatarProps={{radius: "full", size: "sm", src: item.urlImageProduct}}
                    classNames={{
                        name: "font-bold text-gray-800 dark:text-white",
                        description: "text-gray-800 dark:text-white",
                    }}
                    description={item.description ?? "N/A"}
                    name={item.productName ?? "N/A"}
                >
                    {item.description ?? "N/A"} {/* Also include email here if it's meant to be shown */}
                </User>
            );
        case "action":
            return (
                <div className="relative flex items-center gap-2">

                    <Tooltip content="Edit">
                        <span onClick={()=>{
                            handleDetail(item.productId)
                        }}  className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon/>
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                        <span onClick={()=>{
                            handleDelete(item.productId)
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