import {
  Avatar,
  AvatarGroup,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  User,
} from "@heroui/react"; // Assuming @heroui/react maps to your actual UI library (e.g., NextUI)

import { VerticalDotsIcon } from "@/components/UI/Table/IconTable.tsx";
import { formatVND } from "@/Utils/FormatVND.tsx";
import {CheckCircle, Clock, Loader2, XCircle} from "lucide-react";
const statusIconMap: Record<string, JSX.Element> = {
    Pending: <Clock className="w-4 h-4 text-warning" />,
    In_Progress: <Loader2 className="w-4 h-4 animate-spin text-primary" />,
    Complete: <CheckCircle className="w-4 h-4 text-success" />,
    Cancel: <XCircle className="w-4 h-4 text-danger" />,
};

const statusStyleMap: Record<string, string> = {
    Pending: "bg-warning/10 text-warning",
    In_Progress: "bg-primary/10 text-primary",
    Complete: "bg-success/10 text-success",
    Cancel: "bg-danger/10 text-danger",
};



const statusColorMap: { [key: string]: "success" | "danger" | "warning" | "primary" | "default" } = {
  active: "success",
  paused: "danger",
  Active: "success",
  InActive: "warning",
  vacation: "warning",
  Pending: "warning",
  In_Progress: "primary",
  Complete: "success",
  Cancel: "danger",
};

const priorityColorMap: { [key: string]: string } = {
    Hight: "text-danger bg-danger/10",     // đỏ chữ + nền đỏ nhạt
    Medium: "text-warning bg-warning/10", // vàng chữ + nền vàng nhạt
    Low: "text-success bg-success/10",    // xanh lá chữ + nền xanh lá nhạt
};


const RenderCell = (object: any, columnKey: string) => {
  const cellValue = object[columnKey];

  switch (columnKey) {
    case "taskType":
      return <span>{object?.taskType?.taskName ?? "N/A"}</span>;

      case "statusTask":
          const status = object.status;
          const statusLabel = status?.replace("_", " ") ?? "N/A";

          return (
              <Chip
                  className={`capitalize border-none gap-1 px-3 py-1 font-semibold text-sm rounded-lg ${statusStyleMap[status] || "bg-default-100 text-default-800"}`}
                  startContent={statusIconMap[status] || <span className="text-default-500">●</span>}
                  size="sm"
                  variant="flat"
              >
                  {statusLabel}
              </Chip>
          );


      case "level":
          return (
              <Chip
                  className={`capitalize border-none gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${priorityColorMap[object.level] || "text-default-800 bg-default-100"}`}
                  size="sm"
                  variant="flat"
              >
                  {object.level ?? "N/A"}
              </Chip>
          );


      case "completeAt":
      return object.completeAt
          ? new Date(object.completeAt).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          : "N/A";

    case "warehouseName": // Consolidated the duplicate warehouseName case
      return <span className={"text-blue-400"}>{object?.warehouses?.warehouseName ?? "N/A"}</span>;

    case "taskUsers":
      return (
          <AvatarGroup isBordered max={3} size="sm">
            {Array.isArray(object.taskUsers) && object.taskUsers.map((user: any, index: number) => (
                <Avatar key={index} name={user?.id?.slice(0, 2) || "U"} />
            ))}
          </AvatarGroup>
      );

    case "userName":
      return (
          <User
              avatarProps={{ radius: "full", size: "sm", src: object.urlImage }}
              description={object.email ?? "N/A"}
              name={object.userName ?? "N/A"}
          >
            {object.email ?? "N/A"} {/* Also include email here if it's meant to be shown */}
          </User>
      );

    case "name": // Assuming this is another User rendering, maybe for products or generic names
      return (
          <User
              avatarProps={{ radius: "full", size: "sm", src: object.avatar }}
              classNames={{
                name: "font-bold text-gray-800 dark:text-white",
                description: "text-gray-800 dark:text-white",
              }}
              description={object.email ?? "N/A"}
              name={cellValue ?? "N/A"}
          >
            {object.email ?? "N/A"} {/* Also include email here if it's meant to be shown */}
          </User>
      );

    case "role":
      return (
          <div className="flex flex-col text-gray-800 dark:text-white">
            <p className="font-bold text-sm text-gray-800 dark:text-white capitalize">{cellValue ?? "N/A"}</p> {/* Corrected text-small to text-sm and text-bold to font-bold */}
            <p className="font-bold text-xstext-gray-800 dark:text-white capitalize text-default-500"> {/* Corrected text-tiny to text-xs and text-bold to font-bold */}
              {object.team ?? "N/A"}
            </p>
          </div>
      );

    case "binCount":
      const totalBins = 12; // Assuming total is always 12 based on the division logic
      const filledBins = object.bin?.length ?? 0;
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

    case "price":
      return <span>{cellValue ? formatVND(Number(cellValue)) : formatVND(0)}</span>;

    case "status": // Assuming this is for a different status field than statusTask
      return (
          <Chip
              className="capitalize border-none gap-1 text-gray-800 dark:text-white"
              color={statusColorMap[cellValue] || "default"}
              size="sm"
              variant="dot"
          >
            {cellValue ?? "N/A"}
          </Chip>
      );

    case "statusStack": // This seems specific, likely stack status based on bin count
      const stackStatus = object.bin?.length === 12 ? "danger" : "success"; // Color based on fullness

      return (
          <Chip
              className="border-none gap-1 text-gray-800 dark:text-white"
              color={stackStatus}
              size="sm"
              variant="dot"
          >
            {cellValue ?? "N/A"} {/* cellValue might be text like "Full" or "Partial" */}
          </Chip>
      );

    case "productName":
      return (
          <User
              avatarProps={{ radius: "full", size: "md", src: object.avatar }}
              classNames={{ description: "text-default-500" }}
              description={object.category ?? "N/A"}
              name={object.productName ?? "N/A"}
          >
            {object.category ?? "N/A"} {/* Include category text inside User for structure */}
          </User>
      );

    case "actions":
      return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="text-gray-800 dark:text-white bg-background border-1 border-default-200">
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
      // Handle any other column key just displaying the plain value
      return <span className={"text-gray-800 dark:text-white"}>{cellValue ?? "N/A"}</span>;
  }
};

export default RenderCell;