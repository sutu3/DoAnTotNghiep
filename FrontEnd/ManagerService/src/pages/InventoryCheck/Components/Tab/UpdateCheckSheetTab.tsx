import React, { useState } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Input,
    Textarea,
    Chip,
    Progress
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import {
    InventoryCheckDetail,
    InventoryCheckDetailCreate,
    InventoryCheckSheet
} from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";
import {
    MiddleUpdateCheckDetails, MiddleUpdateStatusApproveCheckSheets,
} from "@/pages/InventoryCheck/Store/Thunk/InventoryCheckSheetThunk.tsx";
import { useDispatch } from 'react-redux';
import {useFileStore} from "@/zustand/File.tsx";
import {MiddleUploadImage, UploadResponse } from '@/Store/Thunk/UploadThunk';

interface UpdateCheckSheetTabProps {
    checkSheet: InventoryCheckSheet;
    setCheckSheet: (checkSheet: InventoryCheckSheet) => void;
    onBack: () => void;
    onSuccess: () => void;
}

const UpdateCheckSheetTab: React.FC<UpdateCheckSheetTabProps> = ({
                                                                     checkSheet,
                                                                     setCheckSheet,
                                                                     onBack,
                                                                     onSuccess
                                                                 }) => {
    const [loading, setLoading] = useState(false);
    const { setFile } = useFileStore.getState(); // ✅ lấy file từ zustand

    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch=useDispatch();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [checkDetails, setCheckDetails] = useState(checkSheet.checkDetails || []);

    const handleActualQuantityChange = (index: number, actualQuantity: number) => {
        setCheckDetails((prev: any[]) => prev.map((item, i) => {
            if (i === index) {
                const difference = actualQuantity - item.systemQuantity;
                return {
                    ...item,
                    actualQuantity,
                    difference
                };
            }
            return item;
        }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFile(file);
            setSelectedFile(file);
        }
    };
    const handleUpdateItem = async (item: InventoryCheckDetail) => {
        try {

            setLoading(true);
            // Giả sử bạn có API cập nhật detail riêng
            const updateItem:InventoryCheckDetailCreate={
                inventoryWarehouseId: item.inventoryWarehouseId,
                systemQuantity: item.systemQuantity,
                actualQuantity: item.actualQuantity,
                adjustmentReason: item.adjustmentReason||"",
                notes: item.notes||""
            }
           const payload:InventoryCheckSheet= await (dispatch as any)(MiddleUpdateCheckDetails(updateItem,checkSheet.checkSheetId,item.checkDetailId))
            setCheckSheet(payload)
            setLoading(false);

        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteCheck = async () => {
        setLoading(true);
        try {
            // 1. Upload file if selected
            if (selectedFile) {
                const imageResponse:UploadResponse=await (dispatch as any)(MiddleUploadImage());
                const payload:InventoryCheckSheet= await (dispatch as any)(MiddleUpdateStatusApproveCheckSheets(checkSheet,imageResponse?.urlImage))
                setCheckSheet(payload)

            }


            // await updateCheckSheet(updateData);
            onSuccess();
        } catch (error) {
            console.error('Error completing check sheet:', error);
        } finally {
            setLoading(false);
        }
    };

    const completedItems = checkDetails.filter((item: any) =>
        item.actualQuantity !== undefined && item.actualQuantity !== null
    ).length;

    const progressPercentage = checkDetails.length > 0
        ? (completedItems / checkDetails.length) * 100
        : 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <Button isIconOnly variant="light" onPress={onBack}>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <div className="bg-orange-600 rounded-lg p-2">
                                <Icon icon="mdi:clipboard-edit" className="text-xl text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Cập Nhật Phiếu Kiểm Kê
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {checkSheet.checkSheetNumber}
                                </p>
                            </div>
                        </div>
                        {checkSheet.status!="APPROVED"&&<div className="flex gap-2">
                            <Button
                                color="primary"
                                startContent={<Save className="w-4 h-4" />}
                                onPress={handleCompleteCheck}
                                isLoading={loading}
                            >
                                Hoàn thành kiểm kê
                            </Button>
                        </div>}

                    </div>
                </CardHeader>
            </Card>

            {/* Progress */}
            <Card>
                <CardBody>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Tiến Độ Kiểm Kê</h3>
                            <span className="text-2xl font-bold text-purple-600">
                                {completedItems}/{checkDetails.length}
                            </span>
                        </div>
                        <Progress
                            value={progressPercentage}
                            color="primary"
                            className="h-3"
                        />
                        <p className="text-sm text-gray-600">
                            {Math.round(progressPercentage)}% hoàn thành
                        </p>
                    </div>
                </CardBody>
            </Card>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Danh sách sản phẩm kiểm kê */}
                <div className="xl:col-span-2">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">
                                Danh Sách Kiểm Kê ({checkDetails.length})
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div className="space-y-4">
                                {checkDetails.map((item: InventoryCheckDetail, index: number) => (
                                    <CardBody className="p-4">
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Sản phẩm */}
                                            <div className={"flex justify-between items-center"}>
                                                <Icon icon="mdi:package-variant" width="24" height="24" className="text-gray-600 mt-1" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Sản phẩm</p>
                                                    <p className="font-semibold">{item?.inventoryWarehouseDetails?.productDetails?.productName}</p>
                                                    <p className="text-xs text-gray-500">
                                                        SKU: {item?.inventoryWarehouseDetails?.productDetails?.sku}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* SL hệ thống */}
                                            <div>
                                                <p className="text-sm text-gray-600">SL hệ thống</p>
                                                <p className="font-semibold text-blue-600">
                                                    {item.systemQuantity}
                                                </p>
                                            </div>

                                            {/* SL thực tế */}
                                            <div>
                                                <Input
                                                    label="SL thực tế"
                                                    type="number"
                                                    value={item.actualQuantity?.toString() || ''}
                                                    onChange={(e) => handleActualQuantityChange(index, parseFloat(e.target.value) || 0)}
                                                    variant="bordered"
                                                    size="sm"
                                                />
                                            </div>

                                            {/* Chênh lệch */}
                                            <div>
                                                <p className="text-sm text-gray-600">Chênh lệch</p>
                                                <Chip
                                                    color={item.difference === 0 ? 'default' : item.difference > 0 ? 'success' : 'danger'}
                                                    variant="flat"
                                                    size="sm"
                                                >
                                                    {item.difference > 0 ? '+' : ''}{item.difference || 0}
                                                </Chip>
                                            </div>
                                        </div>

                                        {/* Textarea và Nút cập nhật */}
                                        <div className="mt-3 flex flex-col md:flex-row md:items-center gap-3">
                                            <Textarea
                                                label="Lý do điều chỉnh"
                                                placeholder="Nhập lý do nếu có chênh lệch..."
                                                value={item.adjustmentReason || ''}
                                                onChange={(e) => {
                                                    const newDetails = [...checkDetails];
                                                    newDetails[index] ={...newDetails[index],adjustmentReason: e.target.value};
                                                    setCheckDetails(newDetails);
                                                }}
                                                variant="bordered"
                                                size="sm"
                                                minRows={2}
                                            />
                                            {
                                                checkSheet.status !== 'COMPLETED'&&<Button
                                                    color="success"
                                                    variant="flat"
                                                    onPress={() => handleUpdateItem(item)}
                                                    isLoading={loading}
                                                    className="self-end"
                                                >
                                                    Cập nhật
                                                </Button>
                                            }

                                        </div>
                                    </CardBody>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Upload file và hoàn thành */}
                <div className="xl:col-span-1">
                    <Card>
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Upload Phiếu Đã Ký</h3>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Icon icon="mdi:cloud-upload" className="text-4xl text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-600">
                                        Nhấn để chọn file hoặc kéo thả
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        PDF, JPG, PNG (Max 10MB)
                                    </p>
                                </label>
                            </div>

                            {selectedFile && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                                    <FileText className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-800">
                                        {selectedFile.name}
                                    </span>
                                </div>
                            )}

                            {uploadProgress > 0 && (
                                <Progress
                                    value={uploadProgress}
                                    color="success"
                                    className="h-2"
                                />
                            )}

                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">
                                    Quy trình hoàn thành:
                                </h4>
                                <ol className="text-sm text-blue-700 space-y-1">
                                    <li>1. Nhập số lượng thực tế cho tất cả sản phẩm</li>
                                    <li>2. Upload file phiếu kiểm kê đã ký</li>
                                    <li>3. Hệ thống tự động tạo stock movements</li>
                                    <li>4. Cập nhật inventory warehouse</li>
                                </ol>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UpdateCheckSheetTab;



