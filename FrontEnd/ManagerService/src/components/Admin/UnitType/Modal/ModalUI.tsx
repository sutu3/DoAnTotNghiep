import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import {Layers} from "lucide-react";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import {useState} from "react";
import  {UnitCreate} from "@/Store/Unit.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddUnit} from "@/Store/Thunk/UnitThunk.tsx";
import CategoryForm from "@/components/Form/CategoryForm.tsx";
interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
}
const ModalUnit=({open,setOpen}:Props)=>{
    const dispatch = useDispatch();
    const [formData,setFormData]=useState<UnitCreate>({
        IsDefault: false,
        RatioToBase: 0,
        createByUser: "",
        groupUnit: "",
        shortName: "",
        unitName:"",
    })
    const handleChange = (key: string, value: string|number) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };
    const handleAddUtil=async ()=>{
        await (dispatch as any)(MiddleAddUnit(formData));
        setFormData({
            IsDefault: false,
            RatioToBase: 0,
            createByUser: "",
            groupUnit: "",
            shortName: "",
            unitName:"",
        })
        setOpen(false);
    }
    return (
        <ModalUI
            size={"2xl"}
            footer={
                <ButtonUI
                    className={"bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"}
                    label={"Add Unit"}
                    loading={false}
                    startContent={<Layers/>}
                    onClick={handleAddUtil} variant={undefined}                />
            }
            isOpen={open}
            title="Thêm Mới Đơn vị"
            onOpenChange={setOpen}
        >
            <CategoryForm data={formData} onChange={handleChange} />
        </ModalUI>
    )
}
export default ModalUnit;