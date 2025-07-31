import { Card, CardBody, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import {Unit} from "@/Store/Unit.tsx";
import {Product} from "@/Store/ProductSlice.tsx";

interface BinLocationSelectorProps {
    selectedUnit:Unit|null;
    product:Product|null;
    binLocations: any[];
    selectedBin: any;
    onBinSelect: (bin: any) => void;
}

export default function BinLocationSelector({ binLocations, selectedBin, onBinSelect,product,selectedUnit }: BinLocationSelectorProps) {
    const calculatedQuantiry = (quantiry:number) => {
        if (!product || !selectedUnit) return 0;
        const ratioToBase = selectedUnit?.ratioToBase || 1;

        return (quantiry*product?.unit?.ratioToBase)/ratioToBase;
    };
    return (
        <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
                <Icon icon="mdi:map-marker" />
                Chọn vị trí Bin
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {binLocations.map((inventory) => (
                    <Card
                        key={inventory.inventoryWarehouseId}
                        isPressable
                        isHoverable
                        className={`cursor-pointer transition-all ${
                            selectedBin?.inventoryWarehouseId === inventory.inventoryWarehouseId
                                ? 'ring-2 ring-primary bg-primary-50'
                                : 'hover:bg-gray-50'
                        }`}
                        onPress={() => onBinSelect(inventory)}
                    >
                        <CardBody className="p-3">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{inventory.binDetails?.binCode}</p>
                                </div>
                                <div className="text-right">
                                    <Chip
                                        size="sm"
                                        color={inventory.quantity > 0 ? "success" : "danger"}
                                        variant="flat"
                                    >
                                        {calculatedQuantiry(inventory.quantity)}
                                    </Chip>
                                    {inventory.expiryDate && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            HSD: {new Date(inventory.expiryDate).toLocaleDateString('vi-VN')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </div>
    );
}