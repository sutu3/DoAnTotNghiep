import { useState, useEffect } from "react";
import PageHeader from "@/components/Staff/ExecuteImport/PageHeader.tsx";
import ImportOrderInfo from "@/components/Staff/ExecuteImport/ImportOrderInfo .tsx";
import ImportItemsTable from "@/components/Staff/ExecuteImport/Table/ImportItemsTable .tsx";
import LocationSelectionModal from "@/components/Staff/ExecuteImport/Modal/LocationSelectionModal.tsx";
import {pageApi} from "@/Constants/UrlApi.tsx";
import { MiddleGetAllOrderByStatus} from "@/Store/Thunk/ImportOrderThunk.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ExecuteImportItem, ImportOrderItem} from "@/Store/ImportOrder.tsx";
import {OrderItemSelector, OrderSelector, StacksSelector} from "@/Store/Selector.tsx";
import { MiddleGetAllStackList} from "@/Store/Thunk/StackThunk.tsx";
import {Bin, StackType} from "@/Store/StackSlice.tsx";
import {getStatusFromBinAndQuantity} from "@/Utils/GetStatusOrder.tsx";



export interface StackBinData {
    stackId: string;
    stackName: string;
    bins: Bin[];
}
export default function ExecuteImportPage() {
    const dispatch = useDispatch();
    // Mock data cho stacks và bins
    const item=useSelector(OrderItemSelector);
    const stacksBinData=useSelector(StacksSelector)
    const OrderImport=useSelector(OrderSelector)[0]; // Khởi tạo với mock data
    const [items, setItems] = useState<ImportOrderItem[]>([]);
    const [stackBin,setStackBin]=useState<StackType[]>([]);
    const [selectedItem, setSelectedItem] = useState<ExecuteImportItem | null>(null); // Sửa lỗi: không nên set mockImportOrder
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setItems(item);
        setStackBin(stacksBinData)
    }, [item,stacksBinData]);
    useEffect(() => {
        const PageApi: pageApi = { pageNumber:  0, pageSize: 5 };
        const fetchData = async () => {
            await (dispatch as any)(MiddleGetAllOrderByStatus("InProgress",PageApi));
            await (dispatch as any)(MiddleGetAllStackList());
        };
        fetchData();
            },
        []);



    const handleItemCheck = (itemId: string, realityQuantity: number) => {
        setItems(prev => prev.map(item =>
            item.itemId === itemId
                ? { ...item, realityQuantity}
                : item
        ));
    };

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
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Log completed items
            const completedItems = items.filter(item => getStatusFromBinAndQuantity(item) === 'imported');
            console.log("Completed import for items:", completedItems);

            alert(`Đã hoàn thành nhập ${completedItems.length} sản phẩm vào kho!`);
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

                <ImportOrderInfo importOrder={OrderImport} />

                <ImportItemsTable
                    items={items}
                    onItemCheck={handleItemCheck}
                    onSelectLocation={handleSelectLocation}
                    onCompleteImport={handleCompleteImport}
                    loading={loading}
                />

                <LocationSelectionModal
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