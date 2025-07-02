import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip, User,} from "@heroui/react";

import {DeleteIcon, EditIcon} from "lucide-react";

import React from "react";
import {VerticalDotsIcon} from "@/components/UI/Table/IconTable.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";


export interface Props {
    item: Supplier;
    columnKey: string;
    open: boolean;
    setOpen: (open: boolean) => void;
    handleDelete: (name: string) => void;
    handleDetail: (name: string) => void;
}

const RenderCell: React.FC<Props> = ({
                                         item,
                                         columnKey,
    setOpen,
    open,
                                            handleDelete,
                                         handleDetail
                                     }) => {

    const cellValue = item[columnKey as keyof Supplier];

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
        case "supplierName":
            return (
                <User
                    avatarProps={{radius: "full", size: "sm", src: item.urlSupplier}}
                    classNames={{
                        name: "font-bold text-gray-800 dark:text-white",
                        description: "text-gray-800 dark:text-white",
                    }}
                    description={item.email ?? "N/A"}
                    name={item.supplierName ?? "N/A"}
                >
                    {item.email ?? "N/A"} {/* Also include email here if it's meant to be shown */}
                </User>
            );
        case "action":
            return (
                <div className="relative flex items-center gap-2">

                    <Tooltip content="Edit">
                        <span onClick={()=>{
                            setOpen(!open);
                            handleDetail(item.supplierId)
                        }}  className="text-lg text-default-400 cursor-pointer active:opacity-50">
                            <EditIcon/>
                        </span>
                    </Tooltip>
                    <Tooltip color="danger" content="Delete user">
                        <span onClick={()=>{
                            setOpen(!open);
                            handleDelete(item.supplierId)
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