import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";

import { VerticalDotsIcon } from "@/components/UI/Table/IconTable.tsx";
import { formatVND } from "@/Utils/FormatVND.tsx";
import React from "react";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};
interface ProductProgs {
  object: object;
  columnKey: string;
}
const RenderCell: React.FC<ProductProgs> = ({ object, columnKey }) => {
  const cellValue = object[columnKey];

  switch (columnKey) {
    case "name":
      return (
        <User
          avatarProps={{ radius: "full", size: "sm", src: object.avatar }}
          classNames={{
            description: "text-default-500",
          }}
          description={object.email}
          name={cellValue}
        >
          {object.email}
        </User>
      );
    case "role":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">{cellValue}</p>
          <p className="text-bold text-tiny capitalize text-default-500">
            {object.team}
          </p>
        </div>
      );
    case "price":
      return <span>{formatVND(Number(cellValue))}</span>;
    case "status":
      return (
        <Chip
          className="capitalize border-none gap-1 text-default-600"
          color={statusColorMap[object.status]}
          size="sm"
          variant="dot"
        >
          {cellValue}
        </Chip>
      );
    case "productName":
      return (
        <User
          avatarProps={{ radius: "full", size: "md", src: object.avatar }}
          classNames={{ description: "text-default-500" }}
          description={object.category}
          name={object.productName}
        />
      );
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown className="bg-background border-1 border-default-200">
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                <VerticalDotsIcon className="text-default-400" />
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
      return cellValue;
  }
};

export default RenderCell;
