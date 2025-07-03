import {Select, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES} from "@/Constants/UrlApi.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import {ProductCreate, useProductStore} from "@/zustand/Product.tsx";
import {ApiResponse} from "@/types";
import {Unit} from "@/Store/Unit.tsx";

interface Props {
    formData:ProductCreate
    setFormData: (ket: string, value: string | number) => void,
}

const unitSelect = ({formData,setFormData}: Props) => {
    const warehouse = useSelector(warehouseSelector)?.warehouseId;
    console.log(warehouse);
    const {  setProduct } = useProductStore();
    const [listUnit, setListUnit] = useState<Unit[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const unitList: ApiResponse<Unit[]> = await fetchApi({
                method: "GET",
                url: API_ROUTES.product
                    .unit(null)
                    .search()
                    .unitName,
            });
            setListUnit(unitList.result);
        };
        fetch();
    }, [warehouse]);

    return (
        <Select
            label="unit"
            selectedKeys={[formData.unit]}
            aria-labelledby="Input"

            onSelectionChange={(keys) => {
                const selectedId = Array.from(keys)[0].toString();
                const selectedUnit = listUnit.find(unit => unit.unitID === selectedId);

                if (selectedUnit) {
                    setProduct({unit: selectedUnit.unitName});
                    // ✅ Lưu ID vào formData
                    setFormData("unit", selectedId);
                }
            }}
        >
            {listUnit && listUnit?.map((cat) => (
                <SelectItem
                    aria-labelledby="Input"
                    key={cat.unitID}>{cat.unitName}</SelectItem>
            ))}
        </Select>
    );
};
export default unitSelect;