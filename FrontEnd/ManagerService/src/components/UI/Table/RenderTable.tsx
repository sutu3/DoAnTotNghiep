import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger, Progress,
  User,
} from "@heroui/react";

import { VerticalDotsIcon } from "@/components/UI/Table/IconTable.tsx";
import { formatVND } from "@/Utils/FormatVND.tsx";
import React from "react";
import {StackType} from "@/Store/StackSlice.tsx";

const statusColorMap = {
  active: "success",
  paused: "danger",
  Active:"success",
  InActive:"warning",
  vacation: "warning",
};
interface DataObject {
  id: number | string;
  [key: string]: any;
}
interface ProductProgs {
  object: DataObject|StackType;
  columnKey: string;
}
const RenderCell: React.FC<ProductProgs> = ( object, columnKey ) => {
  const cellValue = object[columnKey];

  switch (columnKey) {
    case "userName":
      return (
          <User
              aria-labelledby="myLabelId"
              avatarProps={{ radius: "full", size: "sm", src: object.urlImage }}
              description={object.email}
              name={object.userName}
          />
      );
    case "name":
      return (
          <User
              aria-labelledby="myLabelId"
              avatarProps={{ radius: "full", size: "sm", src: object.avatar }}
              classNames={{
                name: "font-bold text-default-900", // Chữ đậm
                description: "text-default-900",
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
    case "binCount":
      const total = object.bin?.length ?? 0;
      const percent = total === 0 ? 0 : Math.round(( total/12) * 100);

      return (
          <div className="w-full">
            <div className="flex justify-between text-xs text-default-600 mb-1">
              <span>{12} / {total}</span>
              <span>{percent}%</span>
            </div>
            <Progress
                aria-labelledby="myLabelId"
                value={percent}
                size="sm"
                radius="sm"
                color={percent > 50 ? "success" : "primary"}
            />
          </div>
      );
    case "warehouseName":
      return <span>{object?.warehouses?.warehouseName ?? "N/A"}</span>;
    case "price":
      return <span>{formatVND(Number(cellValue))}</span>;
    case "status":
      return (
        <Chip
            aria-labelledby="myLabelId"
          className="capitalize border-none gap-1 text-default-600"
          color={statusColorMap[object.status]}
          size="sm"
          variant="dot"
        >
          {cellValue}
        </Chip>
      );
    case "statusStack":
      const status=object.bin.length==12?"danger":"success"
      return (
          <Chip
              aria-labelledby="myLabelId"
              className="border-none gap-1 text-default-600"
              color={status}
              size="sm"
              variant="dot"
          >
            {cellValue}
          </Chip>
      );
    case "productName":
      return (
        <User aria-labelledby="myLabelId"
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
      return <span>{cellValue}</span>;;
  }
};

export default RenderCell;
