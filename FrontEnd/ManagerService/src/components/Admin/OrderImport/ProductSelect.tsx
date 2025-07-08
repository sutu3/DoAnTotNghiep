import {Select, SelectItem} from "@heroui/react";
import {ImportItem, OrderRequestImport} from "@/Store/ImportOrder.tsx";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";

interface SelectProps {
    formData:  ImportItem;
    setFormData: (formData: (prev: any) => any) => void;
}

export const ProductSelect = ({ formData, setFormData}:SelectProps) => {
    useEffect(() => {

    }, [])
    return (<Select
        label="Sản phẩm"
        placeholder="Chọn sản phẩm"
        selectedKeys={formData?.product ? [formData.product] : []}
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
            <SelectItem key={p.productId}>{p.productName}</SelectItem>
        ))}
    </Select>)
};