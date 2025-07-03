import {  useState } from "react";
import { Layers } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import StackSummaryPanel from "@/components/Admin/StackSummaryPanel.tsx";

import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import StackForm from "@/components/Form/StackForm.tsx";
import { StacksSelector } from "@/Store/Selector.tsx";
import {MiddleAddStack} from "@/Store/Thunk/StackThunk.tsx";
import {StackCreate, StackType} from "@/Store/StackSlice.tsx";
import TableUI from "@/components/Admin/Stack/Table/TableUI.tsx";

export default function StackPage() {
  const stacks = useSelector(StacksSelector);

  // console.log(totalPageStack);
  const dispatch = useDispatch();
  const [selectedStack, setSelectedStack] = useState<StackType>(stacks[0]);
  const [formState, setFormState] = useState<StackCreate>({
    binQuantity: 0,
    description: "",
    stackName: "",
    warehouse: ""
  })
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };
  const isSidebarCollapsed = localStorage.getItem("theme") == "light";

  const handleOpenModel = () => {
    setIsOpen(!isOpen);
  };
  const handleAddStack = async () => {
    await (dispatch as any)(MiddleAddStack(formState));
    setIsOpen(false);
    setFormState({binQuantity: 0, stackName: "", description: "", warehouse: "" });
  };
  const handleStackClick = (stackId: string) => {
    const found = stacks.find((s: any) => s.stackId === stackId);

    if (found) setSelectedStack(found);
  };
  let stats = selectedStack
    ? {
        total: selectedStack?.bin?.length,
        loaded: selectedStack.bin.filter((b: any) => b.status === "loaded")
          .length,
        free: selectedStack.bin.filter((b: any) => b.status === "free").length,
        empty: 12 - selectedStack?.bin?.filter((b: any) => b.status === "EMPTY").length,
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
                <TableUI setKey={handleStackClick} key={selectedStack?.stackId} open={isOpen} setOpen={handleOpenModel}/>
              </div>
            </div>
          </div>

          {/* RIGHT: Chart + Summary */}
          <div>
            <StackSummaryPanel stack={selectedStack} />
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
        <StackForm data={formState} onChange={handleChange} />
      </ModalUI>
    </div>
  );
}
