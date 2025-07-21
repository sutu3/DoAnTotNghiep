import {Select, SelectItem} from "@heroui/react";
import {ImportItemCreate} from "@/Store/ImportOrder.tsx";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { SupplierSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllSupplierList,} from "@/Store/Thunk/ShupplierThunk.tsx";
import {setProductList} from "@/Store/ProductSlice.tsx";

interface SelectProps {
    formData:  ImportItemCreate;
    setFormData: (formData: (prev: any) => any) => void;
}

export const SupplierSelect = ({ formData, setFormData}:SelectProps) => {
    const dispatch = useDispatch();
    const suppliers=useSelector(SupplierSelector);
    console.log(suppliers);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllSupplierList());
        dispatch(setProductList([]))
    }, [formData?.supplier])
    return (<Select
        aria-labelledby="Input"
        label="Nhà cung cấp"
        placeholder="Chọn nhà cung cấp"
        selectedKeys={formData?.supplier ? [formData.supplier] : []}
        onSelectionChange={(keys) => {
            const supplierId = Array?.from(keys)[0]?.toString();
            const supplier = suppliers?.find((p: { supplierId: string; }) => p.supplierId === supplierId)||[];
            if (supplier) setFormData((prev: any) => ({
                ...prev,
                supplier: supplierId,
                supplierName: supplier.supplierName
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