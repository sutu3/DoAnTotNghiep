import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";
import { useLocation } from "react-router-dom";

import { AdminIcon } from "@/components/UI/Breadcrumbs/IconBreadcrumbs.tsx"; // Giả sử AdminIcon chấp nhận className

interface BreadcrumbsUIProps {
  isDarkMode?: boolean;
}

const BreadcrumbsUI = ({ isDarkMode: _isDarkMode }: BreadcrumbsUIProps) => {
  const locationPath = useLocation().pathname; // ví dụ "/dashboard/profile"
  const pathArray = locationPath.split("/").filter((el) => el !== ""); // loại bỏ phần rỗng

  let accumulatedPath = "";

  const lightModeClasses = {
    list: "bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 shadow-md",
    item: "text-slate-600 data-[current=true]:text-slate-900 data-[current=true]:font-semibold",
    separator: "text-slate-400",
    iconColor: "text-blue-600",
  };

  const darkModeClasses = {
    list: "bg-gradient-to-br from-slate-800 via-neutral-800 to-zinc-900 shadow-small shadow-slate-700/50",
    item: "text-slate-300 data-[current=true]:text-white data-[current=true]:font-semibold",
    separator: "text-slate-500",
    iconColor: "text-sky-400",
  };

  const currentClasses =
    localStorage.getItem("theme") == "light"
      ? lightModeClasses
      : darkModeClasses;

  // console.log(isDarkMode);

  return (
    <Breadcrumbs
      classNames={{
        list: `${currentClasses.list} transition-all duration-300 ease-in-out`,
      }}
      itemClasses={{
        item: `${currentClasses.item} transition-colors duration-300 ease-in-out`,
        separator: `${currentClasses.separator} transition-colors duration-300 ease-in-out`,
      }}
      underline="hover"
      variant="solid"
    >
      <BreadcrumbItem href="/">
        <AdminIcon
          className={`${currentClasses.iconColor} w-5 h-5 transition-colors duration-300 ease-in-out`}
        />
      </BreadcrumbItem>
      {pathArray.map((el, idx) => {
        accumulatedPath += "/" + el;
        const label = el.charAt(0).toUpperCase() + el.slice(1);

        return (
          <BreadcrumbItem
            key={accumulatedPath}
            href={accumulatedPath}
            isCurrent={idx === pathArray.length - 1}
          >
            {label}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumbs>
  );
};

export default BreadcrumbsUI;
