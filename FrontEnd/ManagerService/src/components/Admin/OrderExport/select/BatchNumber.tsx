import {ExportItemCreateUI} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";
import {Input} from "@heroui/input";
import {useEffect, useState} from "react";
import {Button} from "@heroui/button";

interface SelectProps {
    formData:  ExportItemCreateUI;
    setFormData: (formData: (prev: any) => any) => void;
}

export const BatchNumber = ({ formData, setFormData}:SelectProps) => {
    const [isManualBatch, setIsManualBatch] = useState(false);
    const generateBatchNumber = (productId: string, binId: string) => {
        const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const productCode = productId.substring(0, 6).toUpperCase();
        const binCode = binId.substring(0, 3).toUpperCase();
        return `EXP-${productCode}-${binCode}-${date}`;
    };
// Auto-generate nếu không phải manual mode
    useEffect(() => {
        if (!isManualBatch && formData.product && formData.bin) {
            const autoBatch = generateBatchNumber(formData.product, formData.bin);
            setFormData(prev => ({
                ...prev,
                batchNumber: autoBatch
            }));
        }
    }, [formData.product, formData.bin, isManualBatch]);
    return (
        <div className="flex gap-2">
            <Input
                aria-labelledby="Input"
                label="Số lô hàng"
                value={formData.batchNumber || ""}
                onValueChange={(value) => {
                    setFormData(prev => ({
                        ...prev,
                        batchNumber: value
                    }));
                    setIsManualBatch(true);
                }}
                isReadOnly={!isManualBatch}
            />
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsManualBatch(!isManualBatch)}
            >
                {isManualBatch ? "Auto" : "Manual"}
            </Button>
        </div>
    )
};