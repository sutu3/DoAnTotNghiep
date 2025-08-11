// FrontEnd/ManagerService/src/components/Admin/OrderExport/WarehouseSelectionCard.tsx
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";
import SelectWarehouse from "./select/SelectWarehouse";
import SupplierSelect from "./select/SupplierSelect";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface WarehouseSelectionCardProps {
    formData: OrderRequestExportCreate;
    handleOnChange: (key:string, value: string) => void;
}

export default function WarehouseSelectionCard({ formData, handleOnChange }: WarehouseSelectionCardProps) {
    return (
        <Card className="mb-6 shadow-sm border-l-4 border-l-green-500">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:warehouse" className="text-xl text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-800">Thông Tin Cơ Bản</h2>
                </div>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SelectWarehouse formData={formData} handleOnChange={(value)=>handleOnChange("warehouse",value)} />
                    <SupplierSelect formData={formData} handleOnChange={(value)=>handleOnChange("customer",value)} />
                </div>
            </CardBody>
        </Card>
    );
}