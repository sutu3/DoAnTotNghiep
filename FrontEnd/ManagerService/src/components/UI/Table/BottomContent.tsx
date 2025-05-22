import React from "react";
import { Pagination } from "@heroui/react";

interface BottomContentProps {
  selectedKeys: Set<any> | "all";
  itemsLength: number;
  page: number;
  pages: number;
  hasSearchFilter: boolean;
  setPage: (page: number) => void;
}

const BottomContent: React.FC<BottomContentProps> = ({
  selectedKeys,
  itemsLength,
  page,
  pages,
  hasSearchFilter,
  setPage,
}) => {
  return (
    <div className="py-2 px-2 flex justify-between items-center">
      <Pagination
        showControls
        classNames={{
          cursor: "bg-foreground text-background",
        }}
        color="default"
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant="light"
        onChange={setPage}
      />
      <span className="text-small text-default-400">
        {selectedKeys === "all"
          ? "All items selected"
          : `${selectedKeys.size} of ${itemsLength} selected`}
      </span>
    </div>
  );
};

export default BottomContent;
