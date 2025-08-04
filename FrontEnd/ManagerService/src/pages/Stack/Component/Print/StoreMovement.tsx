import {
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Divider,
} from '@heroui/react';
import { Calendar, Package, FileText, Building, Phone, Mail } from 'lucide-react';
import {StockMovement} from "@/Store/StockMovementSlice.tsx";
import {InventoryWarehouse} from "@/Store/InventoryWarehouseSlice.tsx";

interface Props {
    movement: StockMovement[];
    inventoryWarehouse: InventoryWarehouse | null;
}

const StockMovementReport = ({movement, inventoryWarehouse}: Props) => {
    const getQuantityStockMovement = (stockMovement: StockMovement[], type: string | null) => {
        return stockMovement.reduce((total, movement) => {
            if (type === null || movement.movementType === type) {
                return total + (movement.quantity || 0);
            }
            return total;
        }, 0);
    };

    const getMovementTypeText = (type: string) => {
        switch (type) {
            case "IMPORT": return "Nhập kho";
            case "EXPORT": return "Xuất kho";
            case "ADJUSTMENT": return "Điều chỉnh";
            case "TRANSFER": return "Chuyển kho";
            default: return type;
        }
    };

    const columns = [
        { key: "stt", label: "STT" },
        { key: "time", label: "Thời gian" },
        { key: "type", label: "Loại giao dịch" },
        { key: "before", label: "Trước" },
        { key: "after", label: "Sau" },
        { key: "change", label: "Thay đổi" },
        { key: "user", label: "Người thực hiện" },
        { key: "note", label: "Ghi chú" }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-0" id="stock-report">
            {/* Header Card */}
            <Card className="shadow-lg border-0 rounded-b-none">
                <CardBody className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar
                                icon={<FileText className="w-8 h-8" />}
                                className="bg-white/20 text-white"
                                size="lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold">BÁO CÁO LỊCH SỬ GIAO DỊCH KHO</h1>
                                <p className="text-blue-100 mt-1">Warehouse Management System</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-100">Ngày tạo báo cáo</p>
                            <p className="text-lg font-semibold">
                                {new Date().toLocaleDateString('vi-VN')}
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Company Info Card */}
            <Card className="shadow-lg border-0 rounded-none">
                <CardBody className="bg-gray-50 px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <Building className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Công ty</p>
                                <p className="font-semibold">ABC Warehouse Co., Ltd</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Điện thoại</p>
                                <p className="font-semibold">+84 24 1234 5678</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-semibold">info@abcwarehouse.com</p>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Main Content Card */}
            <Card className="shadow-lg border-0 rounded-t-none">
                <CardBody className="p-8 space-y-8">
                    {/* Report Summary */}
                    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-0">
                        <CardHeader className="pb-2">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
                                <h2 className="text-xl font-bold text-gray-800">Thông tin báo cáo</h2>
                            </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="bg-white shadow-sm">
                                    <CardBody className="p-4">
                                        <p className="text-sm text-gray-600">Tổng giao dịch</p>
                                        <p className="font-bold text-blue-600 text-xl">{getQuantityStockMovement(movement, null)}</p>
                                    </CardBody>
                                </Card>
                                <Card className="bg-white shadow-sm">
                                    <CardBody className="p-4">
                                        <p className="text-sm text-gray-600">Tổng nhập</p>
                                        <p className="font-bold text-green-600 text-xl">+{getQuantityStockMovement(movement, "IMPORT")}</p>
                                    </CardBody>
                                </Card>
                                <Card className="bg-white shadow-sm">
                                    <CardBody className="p-4">
                                        <p className="text-sm text-gray-600">Tổng xuất</p>
                                        <p className="font-bold text-red-600 text-xl">-{getQuantityStockMovement(movement, "EXPORT")}</p>
                                    </CardBody>
                                </Card>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Product Information */}
                    <Card className="bg-gray-50 border-0">
                        <CardHeader className="pb-2">
                            <div className="flex items-center">
                                <Package className="w-5 h-5 mr-2 text-green-600" />
                                <h2 className="text-xl font-bold text-gray-800">Thông tin sản phẩm</h2>
                            </div>
                        </CardHeader>
                        <CardBody className="pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Tên sản phẩm</p>
                                        <p className="text-lg font-bold text-gray-800">{inventoryWarehouse?.productDetails?.productName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Mã SKU</p>
                                        <Chip variant="flat" color="default" className="font-semibold">
                                            {inventoryWarehouse?.productDetails?.sku}
                                        </Chip>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Danh mục</p>
                                        <p className="font-semibold text-gray-700">{inventoryWarehouse?.productDetails?.category?.categoryName}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Vị trí kho</p>
                                        <p className="text-lg font-bold text-blue-600">{inventoryWarehouse?.binDetails?.binCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Tên kho</p>
                                        <p className="font-semibold text-gray-700">{inventoryWarehouse?.warehouseDetails?.warehouseName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Số lượng hiện tại</p>
                                        <Chip variant="flat" color="success" size="lg" className="text-xl font-bold">
                                            {inventoryWarehouse?.quantity}
                                        </Chip>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Transaction History - Simplified Table */}
                    <div>
                        <div className="flex items-center mb-6">
                            <FileText className="w-5 h-5 mr-2 text-purple-600" />
                            <h2 className="text-xl font-bold text-gray-800">Lịch sử giao dịch chi tiết</h2>
                        </div>

                        <Table
                            aria-label="Stock movements table"
                            classNames={{
                                wrapper: "shadow-lg border border-gray-200 rounded-lg",
                                th: "bg-gray-100 text-gray-700 font-semibold",
                                td: "py-4"
                            }}
                            removeWrapper={false}
                        >
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn
                                        key={column.key}
                                        align={["before", "after", "change"].includes(column.key) ? "center" : "start"}
                                    >
                                        {column.label}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody>
                                {movement.map((mov, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                <div>{new Date(mov.createdAt || "N/A").toLocaleDateString('vi-VN')}</div>
                                                <div className="text-gray-500">
                                                    {new Date(mov.createdAt || "N/A").toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getMovementTypeText(mov.movementType)}</TableCell>
                                        <TableCell className="text-center">{mov.quantityBefore}</TableCell>
                                        <TableCell className="text-center">{mov.quantityAfter}</TableCell>
                                        <TableCell className="text-center">
                                            {mov.quantityAfter - mov.quantityBefore > 0 ? '+' : ''}{mov.quantityAfter - mov.quantityBefore}
                                        </TableCell>
                                        <TableCell>{mov.performedByUser?.userName || 'N/A'}</TableCell>
                                        <TableCell>{mov.note || '-'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Divider className="my-8" />

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Thời gian tạo:</p>
                            <p className="font-semibold text-gray-800">
                                {new Date().toLocaleString('vi-VN')}
                            </p>
                        </div>
                    </div>

                    <div className="text-center pt-6">
                        <p className="text-xs text-gray-500">
                            Báo cáo này được tạo tự động bởi Warehouse Management System
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            © 2024 ABC Warehouse Co., Ltd - All rights reserved
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default StockMovementReport;