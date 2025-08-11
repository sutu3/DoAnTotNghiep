import React from 'react';
import { Card, CardBody, CardHeader, Input, Textarea, Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import SelectWarehouseDeliveryFilter from "@/pages/InventoryCheck/Components/Select/WarehouseSelect.tsx";

interface BasicInfoStepProps {
    checkSheetNumber: string;
    setCheckSheetNumber: (value: string) => void;
    warehouse: string;
    setWarehouse: (value: string) => void;
    notes: string;
    setNotes: (value: string) => void;
    onNext: () => void;
    canProceed: boolean;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
                                                         checkSheetNumber,
                                                         setCheckSheetNumber,
                                                         warehouse,
                                                         setWarehouse,
                                                         notes,
                                                         setNotes,
                                                         onNext,
                                                         canProceed
                                                     }) => {
    return (
        <Card className="shadow-lg border-0 bg-white ring-2 ring-blue-500">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-200 text-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/40 rounded-lg flex items-center justify-center">
                        <Icon icon="mdi:file-document-edit" className="text-xl text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Thông Tin Cơ Bản</h3>
                        <p className="text-blue-600 text-sm">Thiết lập thông tin phiếu kiểm kê</p>
                    </div>
                </div>
            </CardHeader>
            <CardBody className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Số Phiếu Kiểm Kê"
                        value={checkSheetNumber}
                        onValueChange={setCheckSheetNumber}
                        startContent={<Icon icon="mdi:file-document" className="text-gray-400" />}
                        isRequired
                        variant="bordered"
                        classNames={{
                            input: "font-mono",
                            inputWrapper: "border-gray-200 hover:border-blue-400"
                        }}
                    />
                    <SelectWarehouseDeliveryFilter warehouse={warehouse} setWarehouse={setWarehouse} />
                </div>

                <Textarea
                    label="Ghi Chú"
                    placeholder="Nhập ghi chú cho phiếu kiểm kê..."
                    value={notes}
                    onValueChange={setNotes}
                    minRows={3}
                    variant="bordered"
                    classNames={{
                        inputWrapper: "border-gray-200 hover:border-blue-400"
                    }}
                />

                <div className="flex justify-end">
                    <Button
                        color="primary"
                        onClick={onNext}
                        isDisabled={!canProceed||notes==""}
                        endContent={<Icon icon="mdi:arrow-right" />}
                    >
                        Tiếp theo
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
};

export default BasicInfoStep;