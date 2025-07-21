import {Select, SelectItem} from "@heroui/react";
import {useDispatch, useSelector} from "react-redux";
import {InventoryWarehouseSelector} from "@/Store/Selector.tsx";
import { useEffect} from "react";
import {
    MiddleGetInventoryWarehouseByProductId
} from "@/Store/Thunk/InventoryWarehouseThunk.tsx";
import {ExportItemCreateUI} from "@/Store/ExportOrderSlice.tsx";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";

interface SelectProps {
    formData: ExportItemCreateUI;
    setFormData: (formData: (prev: any) => any) => void;
    onBinSelect?: (availableQty: number) => void; // Thêm callback này
}

const SelectBinLocation = ({formData, setFormData,onBinSelect}: SelectProps) => {
    const inventoryWarehouse: InventoryWarehouse[] = useSelector(InventoryWarehouseSelector);
    const dispatch = useDispatch();

    // Lấy danh sách inventory warehouse khi product thay đổi
    useEffect(() => {
        if (formData.product) {
            (dispatch as any)(MiddleGetInventoryWarehouseByProductId(formData.product));
        }
    }, [formData.product, dispatch]);

    return (
        <Select
            label="Vị trí Bin"
            placeholder="Chọn vị trí bin"
            selectedKeys={formData.bin ? [formData.bin] : []}
            onSelectionChange={(keys) => {
                const binId = Array.from(keys)[0]?.toString();
                const selectedInventory = inventoryWarehouse.find(
                    (inv) => inv.binDetails.binId === binId
                );
                if (selectedInventory) {
                    setFormData((prev: any) => ({
                        ...prev,
                        bin: binId,
                        // Có thể thêm thông tin khác nếu cần
                    }));
                    onBinSelect?.(selectedInventory.quantity);
                }
            }}
            isDisabled={!formData.product || inventoryWarehouse.length === 0}
        >
            {inventoryWarehouse.map((inv: InventoryWarehouse) => (
                <SelectItem
                    aria-labelledby="Input"
                    key={inv.binDetails.binId}
                    textValue={`${inv.binDetails.binCode} (Còn: ${inv.quantity})`}
                >
                    <div className="flex justify-between">
                        <span>{inv.binDetails.binCode}</span>
                        <span className="text-gray-500">Còn: {inv.quantity}</span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
};

export default SelectBinLocation;