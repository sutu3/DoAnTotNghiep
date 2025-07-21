import { useState, useEffect } from "react";
import PageHeader from "@/components/Staff/ExecuteImport/PageHeader.tsx";
import ImportOrderInfo from "@/components/Staff/ExecuteImport/ImportOrderInfo .tsx";
import ImportItemsTable from "@/components/Staff/ExecuteImport/Table/ImportItemsTable .tsx";
import LocationSelectionModal from "@/components/Staff/ExecuteImport/Modal/LocationSelectionModal.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {MiddleGetAllImportOrderByStatus, MiddleImportOrder} from "@/Store/Thunk/ImportOrderThunk.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ExecuteImportItem, ImportOrderItem} from "@/Store/ImportOrder.tsx";
import {OrderItemSelector, OrderSelector, StacksSelector} from "@/Store/Selector.tsx";
import { MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {Bin, StackType} from "@/Store/StackSlice.tsx";
import SelectWarehouseApproved from "@/components/Admin/OrderImport/select/SelectWarehouseApproved.tsx";



export default function ExecuteImportPage() {
    const dispatch = useDispatch();
    // Mock data cho stacks và bins
    const item=useSelector(OrderItemSelector);
    const stacksBinData=useSelector(StacksSelector)
    const OrderImport=useSelector(OrderSelector)[0];
    const [items, setItems] = useState<ImportOrderItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ExecuteImportItem | null>(null); // Sửa lỗi: không nên set mockImportOrder
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [warehouse,setWarehouse] = useState<string>("");


    useEffect(() => {
        setItems(item);
    }, []);
    useEffect(() => {
        const PageApi: pageApi = { pageNumber:  0, pageSize: 5 };
        const fetchData = async () => {
            if(warehouse!=""){
                await (dispatch as any)(MiddleGetAllImportOrderByStatus(warehouse,"InProgress",PageApi));
                await (dispatch as any)(MiddleGetAllStackList());
            }

        };
        fetchData();
            },
        [warehouse]);


    const handleItemCheck = (itemId: string, realityQuantity: number) => {
        setItems(prev => prev.map(item =>
            item.itemId === itemId
                ? { ...item, realityQuantity}
                : item
        ));
    };
    console.log(items)
    const handleSelectLocation = (item: ExecuteImportItem) => {
        setSelectedItem(item);
        setIsLocationModalOpen(true);
    };

    const handleConfirmLocation = (stackId: string, binId: string) => {
        if (selectedItem) {
            // Tìm stack và bin chính xác
            const selectedStackData = stacksBinData.find((stack: StackType) => stack.stackId === stackId);
            const selectedBinData = selectedStackData?.bin.find((bin: Bin) => bin.binId === binId);

            console.log(selectedStackData);
            console.log(selectedBinData);

            setItems(prev => prev.map(item =>
                item.itemId === selectedItem.itemId
                    ? {
                        ...item,
                        bin: selectedBinData,             // Nếu bạn muốn lưu mã Bin
                    }
                    : item
            ));

            console.log(selectedItem);
            setIsLocationModalOpen(false);
            setSelectedItem(null);
        }
    };

    const handleCompleteImport = async () => {
        setLoading(true);
        try {
                await (dispatch as any)(MiddleImportOrder(OrderImport.importOrderId,items));

        } catch (error) {
            console.error("Error completing import:", error);
            alert("Có lỗi xảy ra khi hoàn thành nhập hàng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                <PageHeader />
                <SelectWarehouseApproved warehouse={warehouse} setWarehouse={setWarehouse} />


                <ImportOrderInfo importOrder={OrderImport} />

                <ImportItemsTable
                    warehouse={warehouse}
                    items={items}
                    onItemCheck={handleItemCheck}
                    onSelectLocation={handleSelectLocation}
                    onCompleteImport={handleCompleteImport}
                    loading={loading}
                />

                <LocationSelectionModal
                    warehouse={warehouse}
                    isOpen={isLocationModalOpen}
                    onClose={() => setIsLocationModalOpen(false)}
                    selectedItem={selectedItem}
                    onConfirmLocation={handleConfirmLocation}
                    warehouseId={OrderImport?.warehouse?.warehouseId}
                />
            </div>
        </div>
    );
}