import { Select, SelectItem } from "@heroui/react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SupplierSelector } from "@/Store/Selector";
import { MiddleGetAllSupplierList} from "@/Store/Thunk/ShupplierThunk.tsx";

interface SupplierSelectProps {
    formData: any;
    setFormData: (formData: (prev: any) => any) => void;
}

export default function SupplierSelect({ formData, setFormData }: SupplierSelectProps) {
    const dispatch = useDispatch();
    const suppliers = useSelector(SupplierSelector);

    useEffect(() => {
        (dispatch as any)(MiddleGetAllSupplierList());
    }, [dispatch]);

    return (
        <Select
            label="Khách hàng"
            placeholder="Chọn khách hàng"
            selectedKeys={formData.customer ? [formData.customer] : []}
            onSelectionChange={(keys) => {
                const customerId = Array.from(keys)[0]?.toString();
                setFormData(prev => ({
                    ...prev,
                    customer: customerId
                }));
            }}
        >
            {suppliers.map((supplier: any) => (
                <SelectItem key={supplier.supplierId}>
                    {supplier.supplierName}
                </SelectItem>
            ))}
        </Select>
    );
}