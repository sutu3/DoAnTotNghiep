import { Icon } from '@iconify/react';
import { InventoryCheckSheet } from "@/pages/InventoryCheck/Store/InventoryCheckSlice.tsx";

interface CheckSheetPrintTemplateProps {
    checkSheet: InventoryCheckSheet;
}

const CheckSheetPrintTemplate = ({ checkSheet }: CheckSheetPrintTemplateProps) => {
    // Tính toán thống kê từ checkDetails
    const totalItems = checkSheet.checkDetails?.length || 0;
    const itemsWithDifference = checkSheet.checkDetails?.filter(item => item.difference !== 0).length || 0;
    const accurateItems = checkSheet.checkDetails?.filter(item => item.difference === 0).length || 0;

    return (
        <div className="bg-white p-8 min-h-[297mm] w-[210mm] mx-auto shadow-lg print-content">
            {/* Header - Company Info */}
            <div className="text-center mb-8 border-b-2 border-purple-500 pb-6">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <div className="bg-purple-600 rounded-full p-3">
                        <Icon icon="mdi:clipboard-check" className="text-3xl text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">HỆ THỐNG QUẢN LÝ KHO</h1>
                        <p className="text-lg text-gray-600">Warehouse Management System</p>
                    </div>
                </div>
                <div className="text-sm text-gray-600">
                    <p>Địa chỉ: {checkSheet.warehouseDetails?.address || 'N/A'}</p>
                    <p>Điện thoại: (028) 1234-5678 | Email: warehouse@company.com</p>
                </div>
            </div>

            {/* Document Title */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-purple-600 mb-2">PHIẾU KIỂM KÊ HÀNG HÓA</h2>
                <p className="text-xl text-gray-700">INVENTORY CHECK SHEET</p>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">Số phiếu: <span className="text-purple-600">#{checkSheet.checkSheetNumber}</span></p>
                    </div>
                    <div>
                        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                            checkSheet.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                                checkSheet.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                                    checkSheet.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                        }`}>
                            {checkSheet.status === 'DRAFT' ? 'Nháp' :
                                checkSheet.status === 'COMPLETED' ? 'Hoàn thành' :
                                    checkSheet.status === 'APPROVED' ? 'Đã duyệt' : checkSheet.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Information Grid */}
            <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left Column - Check Sheet Info */}
                <div className="space-y-6">
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-purple-700 mb-4 flex items-center gap-2">
                            <Icon icon="mdi:clipboard-text" />
                            THÔNG TIN PHIẾU KIỂM KÊ
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Số phiếu:</span>
                                <span className="font-mono">{checkSheet.checkSheetNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Ngày kiểm kê:</span>
                                <span>{new Date(checkSheet.checkDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Người thực hiện:</span>
                                <span>{checkSheet.performedByDetails?.userName || checkSheet.performedBy}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Email:</span>
                                <span>{checkSheet.performedByDetails?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Trạng thái:</span>
                                <span className="font-semibold text-purple-600">{checkSheet.status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Warehouse Info */}
                <div className="space-y-6">
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                            <Icon icon="mdi:warehouse" />
                            THÔNG TIN KHO
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Tên kho:</span>
                                <span>{checkSheet.warehouseDetails?.warehouseName || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Mã kho:</span>
                                <span className="font-mono">{checkSheet.warehouseDetails?.warehouseId?.slice(-8) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Địa chỉ:</span>
                                <span>{checkSheet.warehouseDetails?.address || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Quận/Huyện:</span>
                                <span>{checkSheet.warehouseDetails?.district || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Quốc gia:</span>
                                <span>{checkSheet.warehouseDetails?.country || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Statistics */}
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                            <Icon icon="mdi:chart-pie" />
                            THỐNG KÊ KIỂM KÊ
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-blue-50 p-3 rounded">
                                <div className="text-xl font-bold text-blue-600">{totalItems}</div>
                                <div className="text-xs text-blue-700">Tổng SP</div>
                            </div>
                            <div className="bg-green-50 p-3 rounded">
                                <div className="text-xl font-bold text-green-600">{accurateItems}</div>
                                <div className="text-xs text-green-700">Chính xác</div>
                            </div>
                            <div className="bg-orange-50 p-3 rounded">
                                <div className="text-xl font-bold text-orange-600">{itemsWithDifference}</div>
                                <div className="text-xs text-orange-700">Chênh lệch</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Check Details Table */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Icon icon="mdi:table" />
                    CHI TIẾT KIỂM KÊ ({totalItems} sản phẩm)
                </h3>
                <div className="overflow-hidden rounded-lg border border-gray-300">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                        <tr className="bg-gradient-to-r from-purple-100 to-blue-100">
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">STT</th>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Tên Sản Phẩm</th>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Mã SP</th>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Vị Trí</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold">SL Hệ Thống</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold">SL Thực Tế</th>
                            <th className="border border-gray-300 px-3 py-3 text-center font-semibold">Chênh Lệch</th>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Lý Do</th>
                            <th className="border border-gray-300 px-3 py-3 text-left font-semibold">Ghi Chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {checkSheet.checkDetails?.map((item, index) => (
                            <tr key={item.checkDetailId} className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50`}>
                                <td className="border border-gray-300 px-3 py-3 text-center font-medium">{index + 1}</td>
                                <td className="border border-gray-300 px-3 py-3">
                                    <div className="font-medium text-gray-900">
                                        {item.inventoryWarehouseDetails?.productDetails?.productName || 'N/A'}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-3 py-3 font-mono text-blue-600">
                                    {item.inventoryWarehouseDetails?.productDetails?.productId?.slice(-8) || 'N/A'}
                                </td>
                                <td className="border border-gray-300 px-3 py-3">
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                                            {item.inventoryWarehouseDetails?.binDetails?.binCode || 'N/A'}
                                        </span>
                                </td>
                                <td className="border border-gray-300 px-3 py-3 text-center font-semibold text-blue-600">
                                    {item.systemQuantity}
                                </td>
                                <td className="border border-gray-300 px-3 py-3 text-center font-semibold text-green-600">
                                    {item.actualQuantity}
                                </td>
                                <td className={`border border-gray-300 px-3 py-3 text-center font-bold ${
                                    item.difference > 0 ? 'text-green-600 bg-green-50' :
                                        item.difference < 0 ? 'text-red-600 bg-red-50' : 'text-gray-600'
                                }`}>
                                    <div className="flex items-center justify-center gap-1">
                                        <Icon
                                            icon={item.difference > 0 ? "mdi:arrow-up" : item.difference < 0 ? "mdi:arrow-down" : "mdi:equal"}
                                            className="text-sm"
                                        />
                                        {item.difference > 0 ? '+' : ''}{item.difference}
                                    </div>
                                </td>
                                <td className="border border-gray-300 px-3 py-3 text-sm">
                                    {item.adjustmentReason || '-'}
                                </td>
                                <td className="border border-gray-300 px-3 py-3 text-sm">
                                    {item.notes || '-'}
                                </td>
                            </tr>
                        )) || (
                            <tr>
                                <td colSpan={9} className="border border-gray-300 px-3 py-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-2">
                                        <Icon icon="mdi:package-variant-closed" className="text-4xl" />
                                        <span>Không có dữ liệu kiểm kê</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes Section */}
            {checkSheet.notes && (
                <div className="mb-8">
                    <div className="border border-gray-300 rounded-lg p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Icon icon="mdi:note-text" />
                            GHI CHÚ
                        </h3>
                        <div className="bg-gray-50 p-4 rounded border text-sm leading-relaxed">
                            {checkSheet.notes}
                        </div>
                    </div>
                </div>
            )}

            {/* Signature Section */}
            <div className="border-t-2 border-gray-300 pt-8 signature-section">
                <div className="grid grid-cols-3 gap-8 text-center">
                    <div>
                        <h4 className="font-bold mb-4 text-purple-700">NGƯỜI KIỂM KÊ</h4>
                        <div className="h-20 mb-4 border-b border-gray-300"></div>
                        <div className="pt-2">
                            <p className="font-medium text-gray-800">
                                {checkSheet.performedByDetails?.userName || checkSheet.performedBy}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                {checkSheet.performedByDetails?.email || ''}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Ngày: {new Date(checkSheet.checkDate).toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-blue-700">TRƯỞNG KHO</h4>
                        <div className="h-20 mb-4 border-b border-gray-300"></div>
                        <div className="pt-2">
                            <p className="font-medium text-gray-800">_________________</p>
                            <p className="text-xs text-gray-500 mt-1">Ký tên và đóng dấu</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Ngày: ___/___/______
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-green-700">GIÁM ĐỐC</h4>
                        <div className="h-20 mb-4 border-b border-gray-300"></div>
                        <div className="pt-2">
                            <p className="font-medium text-gray-800">_________________</p>
                            <p className="text-xs text-gray-500 mt-1">Ký tên và đóng dấu</p>
                            <p className="text-xs text-gray-400 mt-1">
                                Ngày: ___/___/______
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-gray-500 border-t pt-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon icon="mdi:shield-check" className="text-purple-600" />
                    <span className="font-medium">Phiếu kiểm kê được tạo tự động bởi Hệ thống Quản lý Kho</span>
                </div>
                <p>Ngày in: {new Date().toLocaleString('vi-VN')}</p>
                <p className="mt-1">
                    ID: {checkSheet.checkSheetId} | Tạo lúc: {new Date(checkSheet.createdAt).toLocaleString('vi-VN')}
                </p>
                <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <Icon icon="mdi:information" className="inline mr-1" />
                    Phiếu này có giá trị pháp lý khi có đầy đủ chữ ký và đóng dấu của các bên liên quan
                </div>
            </div>
        </div>
    );
};

export default CheckSheetPrintTemplate;