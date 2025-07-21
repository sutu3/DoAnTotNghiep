import {Select, SelectItem} from "@heroui/react";
import {ImportItemCreate, OrderRequestImportCreate} from "@/Store/ImportOrder.tsx";
import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {MiddleGetAllProductBySearch} from "@/Store/Thunk/ProductThunk.tsx";
import {ProductSelector} from "@/Store/Selector.tsx";
import {setUnitList} from "@/Store/Unit.tsx";

interface SelectProps {
    formData: OrderRequestImportCreate;
    currentItem:  ImportItemCreate;
    setCurrentItem: (formData: (prev: any) => any) => void;
}

export const ProductSelect = ({formData ,currentItem, setCurrentItem}:SelectProps) => {
    const dispatch = useDispatch();
    const products=useSelector(ProductSelector);
    useEffect(() => {
        (dispatch as any)(MiddleGetAllProductBySearch(
            currentItem?.supplier.length!=0?currentItem?.supplier:null,
            formData?.warehouse.length!=0?formData?.warehouse:null));
        dispatch(setUnitList([]))
    }, [currentItem?.supplier,formData?.warehouse])
    return (<Select
        aria-labelledby="Input"
        label="Sản phẩm"
        placeholder="Chọn sản phẩm"
        selectedKeys={currentItem?.product ? [currentItem.product] : []}
        onSelectionChange={(keys) => {
            const productId = Array?.from(keys)[0]?.toString();
            const product = products?.find((p: { productId: string; }) => p.productId === productId)||[];
            console.log("IDSupplier:" +product.supplierId)
            if (product) setCurrentItem((prev: any) => ({
                ...prev,
                product: productId,
                productName: product.productName,
                supplier: product.supplier.supplierId,
                supplierName: product.supplier.supplierName,
                costUnitBase:product.price
            }));
        }}>
        {products?.map((p: {
            productId: Key | null | undefined;
            productName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
        }) => (
            <SelectItem  aria-labelledby="Input" key={p.productId}>{p.productName}</SelectItem>
        ))}
    </Select>)
};