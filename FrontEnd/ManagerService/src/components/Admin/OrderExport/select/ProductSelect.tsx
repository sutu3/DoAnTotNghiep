import {Select, SelectItem} from "@heroui/react";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllProductBySearch} from "@/Store/Thunk/ProductThunk.tsx";
import {ProductSelector} from "@/Store/Selector.tsx";
import {ExportItemCreateUI, OrderRequestExportCreate} from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface SelectProps {
    formData: OrderRequestExportCreate
    currentItem:  ExportItemCreateUI;
    setCurrentItem: (formData: (prev: any) => any) => void;
}

export const ProductSelect = ({formData, currentItem, setCurrentItem}:SelectProps) => {
    const dispatch = useDispatch();
    const products=useSelector(ProductSelector);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllProductBySearch(null,formData.warehouse));
    }, [formData.warehouse])
    return (<Select
        aria-labelledby="Input"
        label="Sản phẩm"
        placeholder="Chọn sản phẩm"
        selectedKeys={currentItem?.product ? [currentItem.product] : []}
        onSelectionChange={(keys) => {
            const productId = Array.from(keys)[0]?.toString();
            const product = products.find((p: { productId: string; }) => p.productId === productId);
            if (product) setCurrentItem((prev: any) => ({
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