import { Input, Button } from "@heroui/react";
import { StackCreate } from "@/Store/StackSlice.tsx";
import { useState } from "react";

interface Props {
    data: StackCreate;
    onChange: (key: string, value: string | number) => void;
}

const StackForm = ({ data, onChange }: Props) => {
    const [selectedQuantity, setSelectedQuantity] = useState<number>(data.binQuantity || 0);

    const handleSelectQuantity = (quantity: number) => {
        setSelectedQuantity(quantity);
        onChange("binQuantity", quantity);
    };

    const quantities = [6, 9, 12];

    return (
        <div className="space-y-4">
            <Input
                aria-labelledby="Input"
                label="Stack Name"
                value={data.stackName}
                onValueChange={(val) => onChange("stackName", val)}
            />
            <Input
                aria-labelledby="Input"
                label="Description"
                value={data.description}
                onValueChange={(val) => onChange("description", val)}
            />

            <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Bin Quantity</p>
                <div className="flex gap-3">
                    {quantities.map((qty) => (
                        <Button
                            aria-labelledby="Input"
                            key={qty}
                            variant={selectedQuantity === qty ? "default" : "outline"}
                            className={`rounded-lg border-2 border-gray-200 px-4 ${selectedQuantity === qty ? "bg-blue-500 text-white" : ""}`}
                            onClick={() => handleSelectQuantity(qty)}
                        >
                            {qty} Bins
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StackForm;
