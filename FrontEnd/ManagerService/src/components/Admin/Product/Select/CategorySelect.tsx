import {Select, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES} from "@/Constants/UrlApi.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import {Category} from "@/Store/CategorySlice.tsx";
import { useProductStore} from "@/zustand/Product.tsx";
import {ApiResponse} from "@/types";
interface Props {
    setFormdata: (ket: String, value: string | number) => void,
}
const CategorySelect = ({ setFormdata }: Props) => {
    const warehouse = useSelector(warehouseSelector)?.warehouseId;
    console.log(warehouse);
    const { product, setProduct } = useProductStore();
    const [listCategory, setListCategory] = useState<Category[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const categoryList: ApiResponse<Category[]> = await fetchApi({
                method: "GET",
                url: API_ROUTES.product
                    .category(null)
                    .search()
                    .byWarehouseId(warehouse).getAllName,
            });
            console.log("🚀 categoryList", categoryList.result); // <-- kiểm tra tại đây
            setListCategory(categoryList.result);
        };
        fetch();
    }, [warehouse]);

    return (
        <Select
            label="Category"
            selectedKeys={[product.category]}
            onSelectionChange={(keys) => {
                const selectedId = Array.from(keys)[0].toString();
                setProduct( {category: selectedId} );
                setFormdata("category", selectedId);
            }}
        >
            {listCategory&&listCategory?.map((cat) => (
                <SelectItem key={cat.categoryId}>{cat.categoryName}</SelectItem>
            ))}
        </Select>
    );
};
export default CategorySelect;