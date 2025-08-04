import {Select, SelectItem} from "@heroui/react";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {CategorySelector} from "@/Store/Selector";
import {MiddleGetAllCategory} from "@/Store/Thunk/CategoryThunk.tsx";
import {Category} from "@/Store/CategorySlice.tsx";

interface SupplierSelectProps {
    category: any;
    setCategory: (category: string) => void;
}

export default function CategorySelect({category, setCategory}: SupplierSelectProps) {
    const dispatch = useDispatch();
    const categories = useSelector(CategorySelector);

    useEffect(() => {
        const fetchCatehory = async () => {
            await (dispatch as any)(MiddleGetAllCategory(null))
        }
        fetchCatehory();
    }, [dispatch]);


    return (
        <Select
            label="Loại sản Phẩm"
            aria-labelledby="Input"
            placeholder="Chọn Loại sản phẩm "
            selectedKeys={category ? [category] : []}
            onSelectionChange={(keys) => {
                const categoryId = Array.from(keys)[0]?.toString();
                setCategory(categoryId);
            }}
        >
            {categories.map((category: Category) => (
                <SelectItem aria-labelledby="Input"
                            key={category.categoryId}>
                    {category.categoryName}
                </SelectItem>
            ))}
        </Select>
    );
}