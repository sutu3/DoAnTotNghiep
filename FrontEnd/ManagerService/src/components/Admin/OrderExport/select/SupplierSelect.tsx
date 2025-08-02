import {Select, SelectItem} from "@heroui/react";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { SupplierSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllSupplierList,} from "@/Store/Thunk/ShupplierThunk.tsx";
import {ExportItemCreateUI} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface SelectProps {
    formData:  ExportItemCreateUI;
    setFormData: (formData: (prev: any) => any) => void;
}

export const SupplierSelect = ({ formData, setFormData}:SelectProps) => {
    const dispatch = useDispatch();
    const suppliers=useSelector(SupplierSelector);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllSupplierList());
    }, [formData?.customer])
    return (<Select
        aria-labelledby="Input"
        label="Nhà khách hàng"
        placeholder="Chọn Khách hàng"
        selectedKeys={formData?.customer ? [formData.customer] : []}
        onSelectionChange={(keys) => {
            const supplierId = Array.from(keys)[0]?.toString();
            const supplier = suppliers.find((p: { supplierId: string; }) => p.supplierId === supplierId);
            if (supplier) setFormData((prev: any) => ({
                ...prev,
                customer: supplierId,
                customerName: supplier.supplierName
            }));
        }}>
        {suppliers.map((p: {
            supplierId: Key | null | undefined;
            supplierName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
        }) => (
            <SelectItem  aria-labelledby="Input" key={p.supplierId}>{p.supplierName}</SelectItem>
        ))}
    </Select>)
};