import {Select, SelectItem} from "@heroui/react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {SupplierSelector} from "@/Store/Selector";
import {MiddleGetAllSupplierList} from "@/Store/Thunk/ShupplierThunk.tsx";
import {OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface SupplierSelectProps {
    formData: OrderRequestExportCreate;
    handleOnChange: (value:string) => void;
}

export default function SupplierSelect({ formData, handleOnChange }: SupplierSelectProps) {
    const dispatch = useDispatch();
    const suppliers = useSelector(SupplierSelector);

    useEffect(() => {
        (dispatch as any)(MiddleGetAllSupplierList());
    }, [dispatch]);

    return (
        <Select
            label="Khách hàng"
            aria-labelledby="Input"
            placeholder="Chọn khách hàng"
            selectedKeys={formData.customer ? [formData.customer] : []}
            onSelectionChange={(keys) => {
                const customerId = Array.from(keys)[0]?.toString();
                handleOnChange(customerId);
                console.log("Selected customer ID:", customerId);


            }}
        >
            {suppliers.map((supplier: any) => (
                <SelectItem aria-labelledby="Input"
                            key={supplier.supplierId}>
                    {supplier.supplierName}
                </SelectItem>
            ))}
        </Select>
    );
}