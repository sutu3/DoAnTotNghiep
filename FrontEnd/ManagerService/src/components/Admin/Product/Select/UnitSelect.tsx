import {Select, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES} from "@/Constants/UrlApi.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import { useProductStore} from "@/zustand/Product.tsx";
import {ApiResponse} from "@/types";
import {Unit} from "@/Store/Unit.tsx";
interface Props {
    setFormdata: (ket: String, value: string | number) => void,
}
const unitSelect = ({ setFormdata }: Props) => {
    const warehouse = useSelector(warehouseSelector)?.warehouseId;
    console.log(warehouse);
    const { product, setProduct } = useProductStore();
    const [listUnit, setListUnit] = useState<Unit[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const unitList: ApiResponse<Unit[]> = await fetchApi({
                method: "GET",
                url: API_ROUTES.product
                    .unit(null)
                    .search()
                    .byWarehouseId(warehouse).getAllName,
            });
            console.log("🚀 unitList", unitList.result); // <-- kiểm tra tại đây
            setListunit(unitList.result);
        };
        fetch();
    }, [warehouse]);

    return (
        <Select
            label="unit"
            selectedKeys={[product.unit]}
            onSelectionChange={(keys) => {
                const selectedId = Array.from(keys)[0].toString();
                setProduct( {unit: selectedId} );
                setFormdata("unit", selectedId);
            }}
        >
            {listunit&&listunit?.map((cat) => (
                <SelectItem key={cat.unitId}>{cat.unitName}</SelectItem>
            ))}
        </Select>
    );
};
export default unitSelect;