import {StackCreate} from "@/Store/StackSlice.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import {Button} from "@heroui/button";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import {Layers} from "lucide-react";
import StackForm from "@/components/Form/StackForm.tsx";
import {useSelector} from "react-redux";
import {warehouseListSelector} from "@/Store/Selector.tsx";
import {Warehouse} from "@/types";

interface AddStackModalProps {
    warehouse:string
    isOpen: boolean;
    onClose: () => void;
    formState: StackCreate;
    onFormChange: (key: string, value: string|number) => void;
    onSubmit: () => Promise<void>;
    loading: boolean;
}

export const AddStackModal = ({
                                  warehouse,
                                  isOpen,
                                  onClose,
                                  formState,
                                  onFormChange,
                                  onSubmit,
                                  loading
                              }: AddStackModalProps) => {
    const warehouseList=useSelector(warehouseListSelector)
    const filerWarehosue=warehouseList?.filter((el:Warehouse)=>el.warehouseId==warehouse)[0]||null;
    console.log(filerWarehosue)
    return (
        <ModalUI
            isOpen={isOpen}
            onOpenChange={onClose}
            title="Create New Storage Stack"
            size="lg"
            footer={
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="bordered"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <ButtonUI
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg"
                        label="Create Stack"
                        loading={loading}
                        startContent={<Layers className="w-4 h-4"/>}
                        onClick={onSubmit} variant={undefined}                    />
                </div>
            }
        >
            <div className="space-y-6">
                <div className="text-center py-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                        <Layers className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Configure your new storage stack with bins and location details
                    </p>
                </div>

                <StackForm warehouse={filerWarehosue} data={formState} onChange={onFormChange} />
            </div>
        </ModalUI>
    );
};