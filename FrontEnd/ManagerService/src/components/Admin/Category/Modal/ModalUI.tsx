import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import {Layers} from "lucide-react";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import UnitForm from "@/components/Form/UnitForm.tsx";
import {useState} from "react";
import {CategoryCreate} from "@/Store/CategorySlice.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddCategory} from "@/Store/Thunk/CategoryThunk.tsx";
import CategoryForm from "@/components/Form/CategoryForm.tsx";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const ModalCategory=({open,setOpen}:Props)=>{
    const dispatch = useDispatch();
    const [formData,setFormData]=useState<CategoryCreate>({
        categoryName: "",
        description: "",
        warehouses: "",
        createByUser: "",
    })
    const handleChange = (key: string, value: string|number) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };
    const handleAddUtil=async ()=>{
        await (dispatch as any)(MiddleAddCategory(formData));
        setFormData({
            categoryName: "",
            description: "",
            warehouses: "",
            createByUser: "",
        })
        setOpen(false);
    }
    return (
        <ModalUI
            size={"xl"}
            footer={
                <ButtonUI
                    className={"bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"}
                    label={"Add Category"}
                    loading={false}
                    startContent={<Layers/>}
                    onClick={handleAddUtil} variant={undefined}                />
            }
            isOpen={open}
            title="Thêm Mới Loại Sản Phẩm"
            onOpenChange={setOpen}
        >
            <CategoryForm data={formData} onChange={handleChange} />
        </ModalUI>
    )
}
export default ModalCategory;