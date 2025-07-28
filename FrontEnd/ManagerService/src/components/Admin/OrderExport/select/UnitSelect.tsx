import {Select, SelectItem} from "@heroui/react";
import {ImportItemCreate} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ProductSelector, UnitSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllUnit} from "@/Store/Thunk/UnitThunk.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";

interface SelectProps {
    formData: ImportItemCreate;
    setFormData: (formData: (prev: any) => any) => void;
}

export const UnitSelect = ({formData, setFormData}: SelectProps) => {
    const dispatch = useDispatch();
    const units = useSelector(UnitSelector);
    const products = useSelector(ProductSelector);

    // 👉 Lấy product an toàn
    const selectedProduct = useMemo(() => {
        return products.find((el: { productId: string; }) => el.productId === formData?.product);
    }, [products, formData?.product]);

    const groupUnitName = selectedProduct?.unit?.groupUnit?.groupName;

    useEffect(() => {
        const pageApiObj: pageApi = {pageNumber: 0, pageSize: 8};
        if (groupUnitName) {
            (dispatch as any)(MiddleGetAllUnit(pageApiObj, groupUnitName));
        }
    }, [groupUnitName, dispatch]);  // ✅ Chỉ chạy khi groupUnitName đổi

    return (
        <Select
            aria-labelledby="Input"
            label="Đơn vị đo"
            placeholder="Chọn đơn vị"
            selectedKeys={formData?.unit ? [formData.unit] : []}
            onSelectionChange={(keys) => {
                const unitID = Array.from(keys)[0]?.toString();
                const unitItem = units.find((u:
                                             { unitID: string; }) => u.unitID === unitID);
                if (unitItem) {
                    setFormData((prev: any) => ({
                        ...prev,
                        unit: unitID,
                        unitName: unitItem.unitName
                    }));
                }
            }}
        >
            {units.map((unit:
                        { unitID: Key | null | undefined;
                            unitName: string | number | boolean |
                                ReactElement<any, string | JSXElementConstructor<any>> |
                                Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                <SelectItem aria-labelledby="Input" key={unit.unitID}>
                    {unit.unitName}
                </SelectItem>
            ))}
        </Select>
    );
};
