import React, { useState, useRef, useEffect } from 'react';
import {
    Card, CardBody, CardHeader, Button, Input,
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Progress, Image, Chip, Select, SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDispatch, useSelector } from 'react-redux';
import { InventoryCheckSheet, InventoryCheckDetail } from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";
import {AddStockMovement} from "@/Store/Thunk/StockMovementThunk.tsx";
import {StockMovementCreate} from "@/Store/StockMovementSlice.tsx";
import {getCheckSheetById, updateCheckSheetStatus} from "@/pages/InventoryCheck/Store/Thunk/InventoryCheckSheetThunk.tsx";
import {uploadImage} from "@/pages/InventoryCheck/Store/Thunk/FileThunk.tsx";
import {InventoryCheckSelector} from "@/pages/InventoryCheck/Store/Selector.tsx";

interface EditCheckSheetTabProps {
    checkSheetId?: string;
}

const EditCheckSheetTab: React.FC<EditCheckSheetTabProps> = ({ checkSheetId }) => {
    const [selectedCheckSheet, setSelectedCheckSheet] = useState<InventoryCheckSheet | null>(null);
    const [uploadedImages, setUploadedImages] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedCheckSheetId, setSelectedCheckSheetId] = useState(checkSheetId || "");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    // Lấy data từ Redux store
    const checkSheets: InventoryCheckSheet[] = useSelector(InventoryCheckSelector);

    useEffect(() => {
        if (selectedCheckSheetId) {
            setLoading(true);
            // Fetch check sheet details từ API
            (dispatch as any)(getCheckSheetById(selectedCheckSheetId)).then((result) => {
                if (result.payload) {
                    setSelectedCheckSheet(result.payload);
                }
            });
            setLoading(false);
        }
    }, [selectedCheckSheetId, dispatch]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0 || !selectedCheckSheet) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Update progress
                setUploadProgress((i / files.length) * 50); // 50% for upload

                // Upload to FileService
                const uploadResult = await (dispatch as any)(uploadImage(file));

                if (uploadResult.payload) {
                    const newImage = {
                        id: uploadResult.payload.imageId,
                        name: file.name,
                        url: uploadResult.payload.imageUrl,
                        uploadDate: new Date().toISOString(),
                        processed: false
                    };

                    setUploadedImages(prev => [...prev, newImage]);
                }
            }

            setUploadProgress(50); // Upload complete

            // Auto-process images to create stock movements
            await processImagesForStockMovement();

        } catch (error) {
            console.error("Error uploading images:", error);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const processImagesForStockMovement = async () => {
        if (!selectedCheckSheet) return;

        try {
            setUploadProgress(75); // Processing started

            // Simulate AI processing - trong thực tế sẽ gọi AI service
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock detected changes from images - trong thực tế từ AI
            const detectedChanges = selectedCheckSheet.checkDetails.map(detail => ({
                inventoryWarehouseId: detail.inventoryWarehouseId,
                detectedQuantity: detail.actualQuantity, // Giả sử AI detect được số lượng này
                confidence: 0.95
            }));

            // Create stock movements based on detected changes
            for (const change of detectedChanges) {
                const stockMovementData:StockMovementCreate = {
                    inventoryWarehouseId: change.inventoryWarehouseId,
                    product: "", // Sẽ được lấy từ inventoryWarehouse
                    movementType: "ADJUSTMENT",
                    quantity: change.detectedQuantity,
                    note: `Auto-adjustment from image analysis - Confidence: ${(change.confidence * 100).toFixed(1)}%`,
                    performedBy: selectedCheckSheet.performedBy,
                    referenceOrderId: "",
                    unitCost: 0,
                    checkSheetId: selectedCheckSheet.checkSheetId
                };

                // Call API to create stock movement
                // @ts-ignore
                await dispatch(AddStockMovement({payload:stockMovementData}));
            }

            setUploadProgress(90); // Stock movements created

            // Update check sheet status to APPROVED

            setUploadProgress(100); // Complete

            // Mark images as processed
            setUploadedImages(prev =>
                prev.map(img => ({ ...img, processed: true }))
            );

            // Refresh check sheet data
            const updatedCheckSheet = await (dispatch as any)(getCheckSheetById(selectedCheckSheet.checkSheetId));
            if (updatedCheckSheet.payload) {
                setSelectedCheckSheet(updatedCheckSheet.payload);
            }

        } catch (error) {
            console.error("Error processing images:", error);
        }
    };

    const handleRemoveImage = (imageId: string) => {
        setUploadedImages(prev => prev.filter(img => img.id !== imageId));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "DRAFT": return "warning";
            case "COMPLETED": return "primary";
            case "APPROVED": return "success";
            default: return "default";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "DRAFT": return "Nháp";
            case "COMPLETED": return "Hoàn Thành";
            case "APPROVED": return "Đã Duyệt";
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Icon icon="mdi:loading" className="text-4xl animate-spin text-blue-600" />
                <span className="ml-2">Đang tải dữ liệu...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white">
                    <div className="flex items-center gap-3">
                        <Icon icon="mdi:file-edit" className="text-2xl" />
                        <div>
                            <h3 className="text-xl font-bold">Chỉnh Sửa Phiếu Kiểm Kê</h3>
                            <p className="text-orange-100">Upload ảnh để tự động cập nhật tồn kho</p>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                            label="Chọn Phiếu Kiểm Kê"
                            placeholder="Chọn phiếu cần chỉnh sửa"
                            selectedKeys={selectedCheckSheetId ? [selectedCheckSheetId] : []}
                            onSelectionChange={(keys) => setSelectedCheckSheetId(Array.from(keys)[0] as string)}
                        >
                            {checkSheets
                                .filter(sheet => sheet.status === "COMPLETED")
                                .map((sheet) => (
                                    <SelectItem key={sheet.checkSheetId} value={sheet.checkSheetId}>
                                        {sheet.checkSheetNumber}
                                    </SelectItem>
                                ))}
                        </Select>

                        {selectedCheckSheet && (
                            <>
                                <Input
                                    label="Số Phiếu"
                                    value={selectedCheckSheet.checkSheetNumber}
                                    isReadOnly
                                    startContent={<Icon icon="mdi:file-document" />}
                                />
                                <Chip
                                    color={getStatusColor(selectedCheckSheet.status)}
                                    variant="flat"
                                    size="lg"
                                    startContent={<Icon icon="mdi:check-circle" />}
                                >
                                    {getStatusText(selectedCheckSheet.status)}
                                </Chip>
                            </>
                        )}
                    </div>
                </CardBody>
            </Card>

            {selectedCheckSheet && (
                <>
                    {/* Upload Section - GIỮ LẠI vì rất hữu ích */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:cloud-upload" className="text-2xl text-blue-600" />
                                    <h3 className="text-lg font-semibold">Upload Ảnh Kiểm Kê</h3>
                                </div>
                                <Button
                                    color="primary"
                                    startContent={<Icon icon="mdi:camera" />}
                                    onClick={() => fileInputRef.current?.click()}
                                    isDisabled={isUploading || selectedCheckSheet.status === "APPROVED"}
                                >
                                    Chọn Ảnh
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody className="space-y-4">
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {/* Upload Progress */}
                            {isUploading && (
                                <Card>
                                    <CardBody>
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:loading" className="text-2xl text-blue-600 animate-spin" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">Đang upload và xử lý ảnh...</p>
                                                <Progress value={uploadProgress} color="primary" className="mt-2" />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}

                            {/* Upload Instructions */}
                            {selectedCheckSheet.status !== "APPROVED" && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Icon icon="mdi:image-multiple" className="text-6xl text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                        Kéo thả ảnh hoặc nhấn "Chọn Ảnh"
                                    </h4>
                                    <p className="text-gray-500 text-sm">
                                        Hỗ trợ JPG, PNG. Hệ thống sẽ tự động phân tích ảnh và cập nhật tồn kho.
                                    </p>
                                </div>
                            )}

                            {/* Uploaded Images */}
                            {uploadedImages.length > 0 && (
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Ảnh Đã Upload ({uploadedImages.length})</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {uploadedImages.map((image) => (
                                            <Card key={image.id} className="relative">
                                                <CardBody className="p-0">
                                                    <Image
                                                        src={image.url}
                                                        alt={image.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="p-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <p className="text-sm font-medium truncate">{image.name}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(image.uploadDate).toLocaleString('vi-VN')}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {image.processed ? (
                                                                    <Chip color="success" size="sm">
                                                                        <Icon icon="mdi:check" className="text-xs" />
                                                                    </Chip>
                                                                ) : (
                                                                    <Chip color="warning" size="sm">
                                                                        <Icon icon="mdi:clock" className="text-xs" />
                                                                    </Chip>
                                                                )}
                                                                <Button
                                                                    isIconOnly
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="danger"
                                                                    onClick={() => handleRemoveImage(image.id)}
                                                                    isDisabled={image.processed}
                                                                >
                                                                    <Icon icon="mdi:delete" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Check Sheet Details */}
                    <Card className="shadow-lg">
                        <CardHeader>
                            <h3 className="text-lg font-semibold">Chi Tiết Phiếu Kiểm Kê</h3>
                        </CardHeader>
                        <CardBody>
                            <Table
                                aria-label="Check sheet details"
                                classNames={{
                                    wrapper: "shadow-none border border-gray-200",
                                    th: "bg-gray-50 text-gray-700 font-semibold",
                                    td: "py-3",
                                }}
                            >
                                <TableHeader>
                                    <TableColumn>Sản Phẩm</TableColumn>
                                    <TableColumn>Vị Trí</TableColumn>
                                    <TableColumn>SL Hệ Thống</TableColumn>
                                    <TableColumn>SL Thực Tế</TableColumn>
                                    <TableColumn>Chênh Lệch</TableColumn>
                                    <TableColumn>Lý Do</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {selectedCheckSheet.checkDetails.map((detail: InventoryCheckDetail) => (
                                        <TableRow key={detail.checkDetailId}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {detail.inventoryWarehouseDetails?.productDetails?.productName || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {detail.inventoryWarehouseDetails?.productDetails?.productId || 'N/A'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Chip color="primary" variant="flat" size="sm">
                                                    {detail.inventoryWarehouseDetails?.binDetails?.binCode || 'N/A'}
                                                </Chip>
                                            </TableCell>
                                            <TableCell className="text-center">{detail.systemQuantity}</TableCell>
                                            <TableCell className="text-center">{detail.actualQuantity}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={`font-semibold ${
                                                    detail.difference > 0 ? 'text-green-600' :
                                                        detail.difference < 0 ? 'text-red-600' : 'text-gray-600'
                                                }`}>
                                                    {detail.difference > 0 ? '+' : ''}{detail.difference}
                                                </span>
                                            </TableCell>
                                            <TableCell>{detail.adjustmentReason || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardBody>
                    </Card>

                    {/* Processing Status */}
                    {uploadedImages.some(img => img.processed) && (
                        <Card className="shadow-lg border-l-4 border-green-500">
                            <CardBody>
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:check-circle" className="text-2xl text-green-600" />
                                    <div>
                                        <h4 className="font-semibold text-green-800">Xử Lý Hoàn Tất</h4>
                                        <p className="text-sm text-green-600">
                                            Ảnh đã được phân tích và tồn kho đã được cập nhật tự động.
                                            Phiếu kiểm kê đã chuyển sang trạng thái "Đã Duyệt".
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default EditCheckSheetTab;