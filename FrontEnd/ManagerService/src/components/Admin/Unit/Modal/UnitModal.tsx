import React, {useState} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Ruler } from "lucide-react";
import UnitForm from "@/components/Form/UnitForm.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddUnit} from "@/Store/Thunk/UnitThunk.tsx";
import {UnitCreate} from "@/Store/Unit.tsx";

interface UnitModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: UnitCreate;
    onFormChange: (key: string, value: string | number | boolean) => void;
}

const UnitModal: React.FC<UnitModalProps> = ({
                                                 isOpen,
                                                 onOpenChange,
                                                 formData,
                                                 onFormChange
                                             }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const handleAddUnit=()=>{
        setLoading(true)
        const fetch=async ()=>{
            await (dispatch as any)(MiddleAddUnit(formData))
            setLoading(false)
        }
        fetch()
        onOpenChange(false)

    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white dark:bg-gray-800",
                header: "border-b border-gray-200 dark:border-gray-700",
                body: "py-6",
                footer: "border-t border-gray-200 dark:border-gray-700"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Ruler className="w-5 h-5 text-orange-600" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thêm đơn vị mới
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                                Điền thông tin để thêm đơn vị vào hệ thống
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <UnitForm data={formData} onChange={onFormChange} />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                isLoading={loading}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                                startContent={<Ruler className="w-4 h-4" />}
                                onPress={handleAddUnit}
                            >
                                Thêm đơn vị
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UnitModal;