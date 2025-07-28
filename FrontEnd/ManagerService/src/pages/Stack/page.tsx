import {useDispatch, useSelector} from "react-redux";
import {StacksSelector} from "@/Store/Selector.tsx";
import {useState} from "react";
import {StackCreate, StackType} from "@/Store/StackSlice.tsx";
import {MiddleAddStack} from "@/Store/Thunk/StackThunk.tsx";
import {StackPageHeader} from "@/components/Admin/Stack/StackPageHeader.tsx";
import {StackTableSection} from "@/components/Admin/Stack/StackTableSection.tsx";
import {StackSummarySection} from "@/components/Admin/Stack/StackSummarySection.tsx";
import {AddStackModal} from "@/components/Admin/Stack/Modal/AddStackModal.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

export default function StackPage() {
  const stacks = useSelector(StacksSelector);
  const dispatch = useDispatch();

  const [selectedStack, setSelectedStack] = useState<StackType | null>(stacks[0] || null);
  const [formState, setFormState] = useState<StackCreate>({
    binQuantity: 0,
    description: "",
    stackName: "",
    warehouse: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSidebarCollapsed = localStorage.getItem("theme") === "light";

  const handleFormChange = (key: string, value: string|number) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleStackClick = (stackId: string) => {
    const found = stacks.find((s: StackType) => s.stackId === stackId);
    if (found) setSelectedStack(found);
  };

  const handleAddStack = async () => {
    setLoading(true);
    try {
      if(formState.stackName.length>3&&formState.description.length>5){
        await (dispatch as any)(MiddleAddStack(formState));
        setIsModalOpen(false);
        setFormState({
          binQuantity: 0,
          stackName: "",
          description: "",
          warehouse: ""
        });
      }
      else{
        showToast({
          title: "Invalid Input",
          description: "Stack name must be > 3 characters and description > 5 characters.",
          color: "danger",
        });
      }

    } catch (error) {
      console.error("Error adding stack:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          <StackPageHeader isDarkMode={isSidebarCollapsed} />

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3">
              <StackTableSection
                  data={formState}
                  onChange={handleFormChange}
                  selectedStack={selectedStack}
                  onStackClick={handleStackClick}
                  onOpenModal={() => setIsModalOpen(true)}
                  isModalOpen={isModalOpen}
              />
            </div>

            <div className="xl:col-span-1">
              <StackSummarySection selectedStack={selectedStack} />
            </div>
          </div>

          <AddStackModal
              warehouse={formState.warehouse}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              formState={formState}
              onFormChange={handleFormChange}
              onSubmit={handleAddStack}
              loading={loading}
          />
        </div>
      </div>
  );
}