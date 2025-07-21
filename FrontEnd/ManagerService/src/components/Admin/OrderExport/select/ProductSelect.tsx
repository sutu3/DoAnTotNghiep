import {Select, SelectItem} from "@heroui/react";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllProductBySearch} from "@/Store/Thunk/ProductThunk.tsx";
import {ProductSelector} from "@/Store/Selector.tsx";
import {ExportItemCreateUI} from "@/Store/ExportOrderSlice.tsx";

interface SelectProps {
    formData:  ExportItemCreateUI;
    setFormData: (formData: (prev: any) => any) => void;
}

export const ProductSelect = ({ formData, setFormData}:SelectProps) => {
    const dispatch = useDispatch();
    const products=useSelector(ProductSelector);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllProductBySearch(null));
    }, [])
    return (<Select
        aria-labelledby="Input"
        label="Sản phẩm"
        placeholder="Chọn sản phẩm"
        selectedKeys={formData?.product ? [formData.product] : []}
        onSelectionChange={(keys) => {
            const productId = Array.from(keys)[0]?.toString();
            const product = products.find((p: { productId: string; }) => p.productId === productId);
            if (product) setFormData((prev: any) => ({
                ...prev,
                product: productId,
                productName: product.productName,
                unitPrice: product.price,
                unit:product.unit.unitID,
                unitName:product.unit.unitName
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