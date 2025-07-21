import {Select, SelectItem} from "@heroui/react";
import {useEffect, useState} from "react";
import {fetchApi} from "@/Api/FetchApi.tsx";
import {API_ROUTES} from "@/Api/UrlApi.tsx";
import {useSelector} from "react-redux";
import {warehouseSelector} from "@/Store/Selector.tsx";
import {ProductCreate, useProductStore} from "@/zustand/Product.tsx";
import {ApiResponse} from "@/types";
import {Supplier} from "@/Store/SupplierSlice.tsx";

interface Props {
    formData:ProductCreate
    setFormData: (ket: string, value: string | number) => void,
}

const SupplierSelect = ({formData,setFormData}: Props) => {
    const warehouse = useSelector(warehouseSelector)?.warehouseId;
    console.log(warehouse);
    const { setProduct} = useProductStore();
    const [listSupplier, setListSupplier] = useState<Supplier[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const SupplierList: ApiResponse<Supplier[]> = await fetchApi({
                method: "GET",
                url: API_ROUTES.user
                    .supplier(null)
                    .search()
                    .byWarehouseId()
                    .getAllName,
            });
            setListSupplier(SupplierList.result);
        };
        fetch();
    }, [warehouse]);

    return (
        <Select
            aria-labelledby="Input"
            label="Supplier"
            selectedKeys={[formData?.supplier]}
            onSelectionChange={(keys) => {
                const selectedId = Array.from(keys)[0].toString();
                const selectedUnit = listSupplier.find(supplier => supplier.supplierId === selectedId);

                if (selectedUnit) {
                    setProduct({supplier: selectedUnit.supplierName});
                    // ✅ Lưu ID vào formData
                    setFormData("supplier", selectedId);
                }
            }}
        >
            {listSupplier && listSupplier?.map((cat) => (
                <SelectItem aria-labelledby="Input"
                            key={cat.supplierId}>{cat.supplierName}</SelectItem>
            ))}
        </Select>
    );
};
export default SupplierSelect;