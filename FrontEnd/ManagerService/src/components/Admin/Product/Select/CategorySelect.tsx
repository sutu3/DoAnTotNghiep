import {Select, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES} from "@/Constants/UrlApi.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import {Category} from "@/Store/CategorySlice.tsx";
import {ProductCreate, useProductStore} from "@/zustand/Product.tsx";
import {ApiResponse} from "@/types";

interface Props {
    formData:ProductCreate
    setFormData: (ket: string, value: string | number) => void,
}

const CategorySelect = ({formData,setFormData}: Props) => {
    const warehouse = useSelector(warehouseSelector)?.warehouseId;
    console.log(warehouse);
    const {  setProduct } = useProductStore();
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
            setListCategory(categoryList.result);
        };
        fetch();
    }, [warehouse]);

    return (
        <Select
            aria-labelledby="Input"
            label="Category"
            selectedKeys={[formData.category]}
            onSelectionChange={(keys) => {
                const selectedId = Array.from(keys)[0].toString();
                const selectedCategory = listCategory.find(cat => cat.categoryId === selectedId);

                if (selectedCategory) {
                    setProduct({category: selectedCategory.categoryName});

                    // ✅ Lưu ID vào formData
                    setFormData("category", selectedCategory.categoryId);
                }
            }}
        >
            {listCategory&&listCategory?.map((cat) => (
                <SelectItem aria-labelledby="Input"
                            key={cat.categoryId}>{cat.categoryName}</SelectItem>
            ))}
        </Select>
    );
};
export default CategorySelect;