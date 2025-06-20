import { useEffect, useState } from "react";
import { Layers } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import TableUI from "@/components/UI/Table/TableUI.tsx";
import StackSummaryPanel from "@/components/Admin/StackSummaryPanel.tsx";
import {
  columns,
  MiddleAddStack,
  MiddleGetAllStack,
} from "@/Store/StackSlice.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import StackForm from "@/components/Form/StackForm.tsx";
import { StacksSelector, TotalPageStack } from "@/Store/Selector.tsx";
import { pageApi } from "@/Constants/UrlApi.tsx";

export default function StackPage() {
  const stacks = useSelector(StacksSelector);
  const totalPageStack = useSelector(TotalPageStack);

  // console.log(totalPageStack);
  const dispatch = useDispatch();
  const [selectedStack, setSelectedStack] = useState(stacks[0]);
  const INITIAL_VISIBLE_COLUMNS = [
    "stackName",
    "description",
    "binCount",
    "statusStack",
    "actions",
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  useEffect(() => {
    const PageApi: pageApi = { pageNumber: page - 1, pageSize: pageSize - 2 };
    const fetchData = async () => {
      (dispatch as any)(MiddleGetAllStack(PageApi));
    };

    fetchData();
  }, [page, pageSize]);
  const [formData, setFormData] = useState({
    stackName: "",
    description: "",
    warehouse: "",
  });

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  const isSidebarCollapsed = localStorage.getItem("theme") == "light";

  const handleOpenModel = () => {
    setIsOpen(!isOpen);
  };
  const handleAddStack = async () => {
    await (dispatch as any)(MiddleAddStack(formData));
    setIsOpen(false);
    setFormData({ stackName: "", description: "", warehouse: "" });
  };
  const handleStackClick = (stackId: string) => {
    const found = stacks.find((s: any) => s.stackId === stackId);

    if (found) setSelectedStack(found);
  };
  const stats = selectedStack
    ? {
        total: 12,
        loaded: selectedStack.bin.filter((b: any) => b.status === "loaded")
          .length,
        free: selectedStack.bin.filter((b: any) => b.status === "free").length,
        empty: 12 - selectedStack.bin.length,
      }
    : { total: 0, loaded: 0, free: 0, empty: 0 };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 sm:p-2 lg:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header + Breadcrumb */}
        <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />

          <div className="sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Stack Page
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor stacks.
            </p>
          </div>
        </div>

        {/* Grid 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Table */}
          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Stack List
                </h2>
              </div>

              <div className="p-0 md:p-4">
                <TableUI
                  columns={columns}
                  getId={(item) =>
                    String(item?.stackId || item?.userId || item?.id || "")
                  }
                  isDarkMode={isSidebarCollapsed}
                  objects={stacks}
                  onchange={handleOpenModel}
                  pageNumber={page}
                  pageSize={pageSize}
                  totalPage={totalPageStack}
                  visibleColumn={INITIAL_VISIBLE_COLUMNS}
                  onGetId={(item) => handleStackClick(item)}
                  onPageChange={setPage}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Chart + Summary */}
          <div>
            <StackSummaryPanel stack={selectedStack} stats={stats} />
          </div>
        </div>
      </div>

      <ModalUI
        footer={
          <ButtonUI
            className={
              "bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"
            }
            label={"Add Stack"}
            loading={false}
            startContent={<Layers />}
            onClick={handleAddStack}
          />
        }
        isOpen={isOpen}
        title="Thêm Mới nhân viên"
        onOpenChange={setIsOpen}
      >
        <StackForm data={formData} onChange={handleChange} />
      </ModalUI>
    </div>
  );
}
