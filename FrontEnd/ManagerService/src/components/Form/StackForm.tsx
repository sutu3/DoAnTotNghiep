import { Input, Button } from "@heroui/react";
import { StackCreate } from "@/Store/StackSlice.tsx";
import { useState } from "react";
import SelectWarehouse from "@/components/Admin/Stack/Select/SelectWarehouse.tsx";
import {Warehouse} from "@/types";

interface Props {
    warehouse:Warehouse
    data: StackCreate;
    onChange: (key: string, value: string | number) => void;
}

const StackForm = ({ warehouse,data, onChange }: Props) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(data.binQuantity || 0);

    const handleSelectQuantity = (quantity: number) => {
        setSelectedQuantity(quantity);
        onChange("binQuantity", quantity);
    };

    const quantities = [6, 9, 12];

    return (
        <div className="space-y-4">
            <p>{warehouse?.warehouseName||"N/A"}</p>
            <p className={"ml-5"}>{warehouse?.warehouseId||"N/A"}</p>

            <Input
                aria-labelledby="Input"
                label="Stack Name"
                value={data.stackName}
                onValueChange={(val) => onChange("stackName", val)}
                validate={(value) => {
                    if (!value || value.length < 2) {
                        return "Stack name must be at least 2 characters";
                    }
                    if (value.length > 50) {
                        return "Stack name must not exceed 50 characters";
                    }
                }}
                isRequired
            />
            <Input
                aria-labelledby="Input"
                label="Description"
                value={data.description}
                onValueChange={(val) => onChange("description", val)}
                validate={(value) => {
                    if (!value || value.length < 5) {
                        return "Description must be at least 5 characters";
                    }
                    if (value.length > 200) {
                        return "Description must not exceed 200 characters";
                    }
                }}
                isRequired
            />

            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Bin Quantity <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-3">
                    {quantities.map((qty) => (
                        <Button
                            aria-labelledby="Input"
                            key={qty}
                            variant={selectedQuantity === qty ? "bordered" : "ghost"}
                            className={`rounded-lg border-2 border-gray-200 px-4 ${
                                selectedQuantity === qty ? "bg-blue-500 text-white" : ""
                            }`}
                            onClick={() => handleSelectQuantity(qty)}
                        >
                            {qty} Bins
                        </Button>
                    ))}
                </div>
                {selectedQuantity === 0 && (
                    <p className="text-red-500 text-sm mt-1">Please select a bin quantity</p>
                )}
            </div>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Bin Quantity <span className="text-red-500">*</span>
                </p>
            </div>
        </div>
    );
};

export default StackForm;