import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Building2 } from "lucide-react";
import WarehouseForm from "@/components/Warehouse/Form/WarehouseForm.tsx";

interface WarehouseModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: any;
    onFormChange: (key: string, value: string | number) => void;
}

const WarehouseModal: React.FC<WarehouseModalProps> = ({
                                                           isOpen,
                                                           onOpenChange,
                                                           formData,
                                                           onFormChange
                                                       }) => {
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
                                <Building2 className="w-5 h-5 text-indigo-600" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thêm kho mới
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                                Điền thông tin để thêm kho vào hệ thống
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <WarehouseForm data={formData} onChange={onFormChange} />
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
                                className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white"
                                startContent={<Building2 className="w-4 h-4" />}
                                onPress={onClose}
                            >
                                Thêm kho
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default WarehouseModal;