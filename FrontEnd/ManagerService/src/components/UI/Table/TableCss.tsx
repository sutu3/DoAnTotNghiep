import React, { useMemo } from "react";

interface TableProgs {
  isDarkMode: boolean;
}
export const TableClassNames: React.FC<TableProgs> = ({ isDarkMode }) => {
  const baseClasses = {
    wrapper: ["max-h-[382px]", "max-w-3xl", "shadow-md rounded-lg"], // Gộp từ cả hai
    table: "min-w-full",
    th: [
      "bg-transparent",
      "text-default-500",
      "border-b",
      "border-divider",
      "text-left font-semibold",
    ], // Gộp
    td: [
      "py-3 px-4", // Gộp
      "group-data-[first=true]/tr:first:before:rounded-none",
      "group-data-[first=true]/tr:last:before:rounded-none",
      "group-data-[middle=true]/tr:before:rounded-none",
      "group-data-[last=true]/tr:first:before:rounded-none",
      "group-data-[last=true]/tr:last:before:rounded-none",
    ],
    // ... các slot khác của Table component bạn muốn style chung
  };

  if (!isDarkMode) {
    // Nhớ sửa isDarkNode thành isDarkMode
    return {
      wrapper: [
        ...baseClasses.wrapper,
        "bg-neutral-900 border border-neutral-700",
      ],
      thead: "border-b border-neutral-700",
      th: [...baseClasses.th, "bg-neutral-800 text-neutral-200 px-4 py-3"],
      tbody: "",
      tr: "border-b border-neutral-800 hover:bg-neutral-800/50",
      td: [...baseClasses.td, "text-neutral-300"],
      emptyWrapper: "text-neutral-400",
      checkboxWrapper:
        "after:bg-primary after:text-primary-foreground text-primary-foreground",
    };
  } else {
    return {
      table: "bg-white border border-neutral-200", // Giữ lại bg-white ở đây
      wrapper: [...baseClasses.wrapper, "bg-white border border-neutral-200"],
      thead: "border-b border-neutral-200",
      th: [...baseClasses.th, "bg-neutral-100 text-neutral-800 px-4 py-3"],
      tbody: "",
      tr: "border-b border-neutral-200 hover:bg-neutral-100/50",
      td: [...baseClasses.td, "text-neutral-700"],
      emptyWrapper: "text-neutral-500",
      checkboxWrapper:
        "after:bg-primary after:text-primary-foreground text-primary-foreground",
    };
  }
};

// Class cho checkboxesProps, có thể cũng thay đổi theo theme
export const CheckboxPropsThemed: React.FC<TableProgs> = ({ isDarkMode }) => {
  if (!isDarkMode) {
    return {
      classNames: {
        wrapper: "after:bg-sky-500 after:text-black text-black mr-2", // Ví dụ cho dark mode
        label: "text-neutral-200",
      },
    };
  }

  return {
    classNames: {
      wrapper: "after:bg-sky-500 after:text-white text-white mr-2", // Ví dụ cho light mode
      label: "text-neutral-800",
    },
  };
};

