import {Select, SelectItem} from "@heroui/react";
import {ImportItem} from "@/Store/ImportOrder.tsx";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllProductBySearch} from "@/Store/Thunk/ProductThunk.tsx";
import {ProductSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllSupplier} from "@/Store/Thunk/ShupplierThunk.tsx";

interface SelectProps {
    formData:  ImportItem;
    setFormData: (formData: (prev: any) => any) => void;
}

export const SupplierSelect = ({ formData, setFormData}:SelectProps) => {
    const dispatch = useDispatch();
    const products=useSelector(ProductSelector);
    console.log(products);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllSupplier(formData?.supplier.length!=0?formData?.supplier:null));
    }, [formData?.supplier])
    return (<Select
        aria-labelledby="Input"
        label="Nhà cung cấp"
        placeholder="Chọn nhà cung cấp"
        selectedKeys={formData?.supplier ? [formData.supplier] : []}
        onSelectionChange={(keys) => {
            const productId = Array.from(keys)[0]?.toString();
            const product = products.find((p: { productId: string; }) => p.productId === productId);
            if (product) setFormData((prev: any) => ({
                ...prev,
                product: productId,
                productName: product.productName
            }));
        }}>
        {products.map((p: {
            productId: Key | null | undefined;
            productName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
        }) => (
            <SelectItem  aria-labelledby="Input" key={p.productId}>{p.productName}</SelectItem>
        ))}
    </Select>)
};