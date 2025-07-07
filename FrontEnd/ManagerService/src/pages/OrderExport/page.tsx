"use client";

import  { useState, useEffect } from "react";
import {
    Button,
    Input,
    Select,
    SelectItem,
    Textarea,
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
    Divider,
    DatePicker
} from "@heroui/react";
import { Icon } from "@iconify/react";
import {Product} from "@/Store/ProductSlice.tsx";
import {Supplier} from "@/Store/SupplierSlice.tsx";

interface ExportItem {
    itemId: string;
    product: string;
    productName: string;
    unit: string;
    unitName: string;
    binLocation?: string;
    quantity: number;
    unitPrice: number;
    batchNumber?: string;
    availableQuantity: number;
}

interface CreateExportOrder {
    warehouse: string;
    createByUser: string;
    customer?: string;
    description: string;
    deliveryDate?: string;
    items: ExportItem[];
}

export default function CreateExportOrderPage() {
    const [formData, setFormData] = useState<CreateExportOrder>({
        warehouse: "",
        createByUser: "",
        customer: "",
        description: "",
        deliveryDate: "",
        items: []
    });

    const [currentItem, setCurrentItem] = useState<ExportItem>({
        itemId: "",
        product: "",
        productName: "",
        unit: "",
        unitName: "",
        quantity: 0,
        unitPrice: 0,
        availableQuantity: 0
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Supplier[]>([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);

    // Sample data tương tự như pattern trong ProductForm
    useEffect(() => {
        const sampleProducts = [
            {
                productId: "prod-001-uuid-string",
                productName: "Laptop Dell Inspiron 15",
                availableQuantity: 25,
                price: 15000000,
                unit: { unitID: "unit-001", unitName: "Chiếc" }
            },
            {
                productId: "prod-002-uuid-string",
                productName: "Chuột không dây Logitech",
                availableQuantity: 150,
                price: 250000,
                unit: { unitID: "unit-001", unitName: "Chiếc" }
            },
            {
                productId: "prod-003-uuid-string",
                productName: "Bàn phím cơ Keychron K2",
                availableQuantity: 75,
                price: 2500000,
                unit: { unitID: "unit-001", unitName: "Chiếc" }
            }
        ];

        const sampleCustomers = [
            { supplierId: "cust-001", supplierName: "Công ty ABC" },
            { supplierId: "cust-002", supplierName: "Công ty XYZ" },
            { supplierId: "cust-003", supplierName: "Công ty DEF" }
        ];

        setProducts(sampleProducts);
        setCustomers(sampleCustomers);
    }, []);

    const handleAddItem = () => {
        if (currentItem.product && currentItem.quantity > 0) {
            const newItem = {
                ...currentItem,
                itemId: Date.now().toString()
            };

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));

            // Reset current item
            setCurrentItem({
                itemId: "",
                product: "",
                productName: "",
                unit: "",
                unitName: "",
                quantity: 0,
                unitPrice: 0,
                availableQuantity: 0
            });
        }
    };

    const handleRemoveItem = (itemId: string) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter(item => item.itemId !== itemId)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Submit export order logic
            console.log("Creating export order:", formData);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert("Đơn xuất hàng đã được tạo thành công!");
        } catch (error) {
            console.error("Error creating export order:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) =>
            total + (item.quantity * item.unitPrice), 0
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-up" className="text-3xl text-orange-600" />
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                            Tạo Đơn Xuất Hàng
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Tạo đơn xuất hàng mới cho khách hàng
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Order Info & Add Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Information */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thông Tin Đơn Xuất Hàng
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Khách hàng"
                                        placeholder="Chọn khách hàng"
                                        selectedKeys={formData.customer ? [formData.customer] : []}
                                        onSelectionChange={(keys) => {
                                            const customerId = Array.from(keys)[0]?.toString();
                                            setFormData(prev => ({ ...prev, customer: customerId }));
                                        }}
                                    >
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.supplierId}>
                                                {customer.supplierName}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    {/*<DatePicker*/}
                                    {/*    label="Ngày giao hàng"*/}
                                    {/*    value={formData.deliveryDate}*/}
                                    {/*    onChange={(date) =>*/}
                                    {/*        setFormData(prev => ({ ...prev, deliveryDate: date }))*/}
                                    {/*    }*/}
                                    {/*/>*/}
                                </div>

                                <Textarea
                                    label="Mô tả đơn hàng"
                                    placeholder="Nhập mô tả cho đơn xuất hàng..."
                                    value={formData.description}
                                    onValueChange={(value) =>
                                        setFormData(prev => ({ ...prev, description: value }))
                                    }
                                />
                            </CardBody>
                        </Card>

                        {/* Add Item Form */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thêm Sản Phẩm Xuất
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select
                                        label="Sản phẩm"
                                        placeholder="Chọn sản phẩm"
                                        selectedKeys={currentItem.product ? [currentItem.product] : []}
                                        onSelectionChange={(keys) => {
                                            const productId = Array.from(keys)[0]?.toString();
                                            const product = products.find(p => p.productId === productId);
                                            if (product) {
                                                setCurrentItem(prev => ({
                                                    ...prev,
                                                    product: productId,
                                                    productName: product.productName,
                                                    availableQuantity: product.availableQuantity,
                                                    unit: product.unit.unitID,
                                                    unitName: product.unit.unitName
                                                }));
                                            }
                                        }}
                                    >
                                        {products.map((product) => (
                                            <SelectItem key={product.productId}>
                                                {product.productName} (Còn: {product.availableQuantity})
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <Input
                                        type="number"
                                        label="Số lượng xuất"
                                        placeholder="0"
                                        value={currentItem.quantity.toString()}
                                        onValueChange={(value) =>
                                            setCurrentItem(prev => ({
                                                ...prev,
                                                quantity: parseInt(value) || 0
                                            }))
                                        }
                                        description={`Có sẵn: ${currentItem.availableQuantity} ${currentItem.unitName}`}
                                    />

                                    <Input
                                        type="number"
                                        label="Đơn giá (VNĐ)"
                                        placeholder="0"
                                        value={currentItem.unitPrice.toString()}
                                        onValueChange={(value) =>
                                            setCurrentItem(prev => ({
                                                ...prev,
                                                unitPrice: parseFloat(value) || 0
                                            }))
                                        }
                                        isReadOnly
                                    />

                                    <Input
                                        label="Vị trí bin"
                                        placeholder="Nhập vị trí bin"
                                        value={currentItem.binLocation || ""}
                                        onValueChange={(value) =>
                                            setCurrentItem(prev => ({
                                                ...prev,
                                                binLocation: value
                                            }))
                                        }
                                    />
                                </div>

                                <Button
                                    color="primary"
                                    startContent={<Icon icon="mdi:plus" />}
                                    onClick={handleAddItem}
                                    isDisabled={
                                        !currentItem.product ||
                                        currentItem.quantity <= 0 ||
                                        currentItem.quantity > currentItem.availableQuantity
                                    }
                                >
                                    Thêm Sản Phẩm
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Items List */}
                        {formData.items.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Danh Sách Sản Phẩm Xuất ({formData.items.length})
                                    </h2>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <TableHeader>
                                            <TableColumn>Sản phẩm</TableColumn>
                                            <TableColumn>Số lượng</TableColumn>
                                            <TableColumn>Đơn giá</TableColumn>
                                            <TableColumn>Thành tiền</TableColumn>
                                            <TableColumn>Vị trí</TableColumn>
                                            <TableColumn>Thao tác</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.items.map((item) => (
                                                <TableRow key={item.itemId}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell>
                                                        <Chip size="sm" variant="flat">
                                                            {item.quantity} {item.unitName}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.unitPrice.toLocaleString('vi-VN')} ₫
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-semibold">
                                                            {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>{item.binLocation || "N/A"}</TableCell>
                                                    <TableCell>
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            color="danger"
                                                            variant="light"
                                                            onClick={() => handleRemoveItem(item.itemId)}
                                                        >
                                                            <Icon icon="mdi:delete" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    {/* Right: Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Tóm Tắt Đơn Hàng
                                </h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Số lượng sản phẩm:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {formData.items.length}
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tổng giá trị:</span>
                                    <span className="font-semibold text-lg text-orange-600">
                                        {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>

                                <Divider />

                                <Button
                                    color="success"
                                    fullWidth
                                    onClick={handleSubmit}
                                    isLoading={loading}
                                    isDisabled={!formData.customer || formData.items.length === 0}
                                    startContent={<Icon icon="mdi:check-bold" />}
                                >
                                    {loading ? "Đang lưu..." : "Tạo Đơn Xuất"}
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}