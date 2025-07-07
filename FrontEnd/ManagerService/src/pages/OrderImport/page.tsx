"use client";

import  { useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal} from "react";
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
    Divider
} from "@heroui/react";
import {Icon} from "@iconify/react";
import { pageApi} from "@/Constants/UrlApi.tsx";
import {MiddleGetAllSupplier} from "@/Store/Thunk/ShupplierThunk.tsx";
import {useDispatch, useSelector} from "react-redux";
import {ProductSelector, SupplierSelector, UnitSelector, warehouseSelector} from "@/Store/Selector.tsx";
import {MiddleGetAllProduct} from "@/Store/Thunk/ProductThunk.tsx";

interface ImportItem {
    itemId: string;
    product: string;
    productName: string;
    supplier: string;
    supplierName: string;
    unit: string;
    unitName: string;
    bin?: string;
    requestQuantity: number;
    costUnitBase: number;
    note?: string;
    expiryDate?: string;
}

interface OrderRequestImport {
    warehouse: string;
    createByUser: string;
    description: string;
    items: ImportItem[];
}

export default function OrderRequestImportForm() {
    const [formData, setFormData] = useState<OrderRequestImport>({
        warehouse: "",
        createByUser: "staff-id-placeholder", // Replace with actual user ID or auth context
        description: "",
        items: [
            {
                "itemId": "item-001-uuid-string",
                "product": "prod-001-uuid-string",
                "productName": "Laptop Dell Inspiron 15",
                "supplier": "sup-001-uuid-string",
                "supplierName": "Công ty TNHH Dell Việt Nam",
                "unit": "unit-001-uuid-string",
                "unitName": "Chiếc",
                "bin": "bin-001-uuid-string",
                "requestQuantity": 10,
                "costUnitBase": 15000000,
                "note": "Laptop cho văn phòng, cần kiểm tra kỹ trước khi nhập",
                "expiryDate": "2026-12-31"
            },
            {
                "itemId": "item-002-uuid-string",
                "product": "prod-002-uuid-string",
                "productName": "Chuột không dây Logitech",
                "supplier": "sup-002-uuid-string",
                "supplierName": "Logitech Việt Nam",
                "unit": "unit-001-uuid-string",
                "unitName": "Chiếc",
                "bin": "bin-002-uuid-string",
                "requestQuantity": 50,
                "costUnitBase": 250000,
                "note": "Chuột wireless cho nhân viên",
                "expiryDate": null
            },
            {
                "itemId": "item-003-uuid-string",
                "product": "prod-003-uuid-string",
                "productName": "Bàn phím cơ Keychron K2",
                "supplier": "sup-003-uuid-string",
                "supplierName": "Keychron Official Store",
                "unit": "unit-001-uuid-string",
                "unitName": "Chiếc",
                "bin": null,
                "requestQuantity": 25,
                "costUnitBase": 2500000,
                "note": "Bàn phím cơ cho developer team",
                "expiryDate": null
            },
            {
                "itemId": "item-004-uuid-string",
                "product": "prod-004-uuid-string",
                "productName": "Giấy A4 Double A",
                "supplier": "sup-004-uuid-string",
                "supplierName": "Double A Việt Nam",
                "unit": "unit-002-uuid-string",
                "unitName": "Thùng",
                "bin": "bin-003-uuid-string",
                "requestQuantity": 5,
                "costUnitBase": 120000,
                "note": "Giấy in cho văn phòng, mỗi thùng 5 ream",
                "expiryDate": "2025-06-30"
            }
        ]
    });
    const dispatch = useDispatch();
    const [currentItem, setCurrentItem] = useState<ImportItem>({
        itemId: "",
        product: "",
        productName: "",
        supplier: "",
        supplierName: "",
        unit: "",
        unitName: "",
        requestQuantity: 0,
        costUnitBase: 0,
        note: "",
        expiryDate: ""
    });
    const products = useSelector(ProductSelector);
    const suppliers = useSelector(SupplierSelector);
    const units = useSelector(UnitSelector);
    const warehouses=useSelector(warehouseSelector)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const PageApi: pageApi = {pageNumber: 0, pageSize: 5};
            try {
                (dispatch as any)(MiddleGetAllSupplier(PageApi));
                (dispatch as any)(MiddleGetAllProduct(PageApi));


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleAddItem = () => {
        if (currentItem.product && currentItem.supplier && currentItem.requestQuantity > 0) {
            const newItem = {
                ...currentItem,
                itemId: Date.now().toString()
            };

            setFormData(prev => ({
                ...prev,
                items: [...prev.items, newItem]
            }));

            setCurrentItem({
                itemId: "",
                product: "",
                productName: "",
                supplier: "",
                supplierName: "",
                unit: "",
                unitName: "",
                requestQuantity: 0,
                costUnitBase: 0,
                note: "",
                expiryDate: ""
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
            // const response = await fetchApi({
            //     method: "POST",
            //     url: API_ROUTES.warehouse.importOrder.create,
            //     data: formData
            // });
            // if (response.success) {
            //     console.log("Order created successfully");
            // }
        } catch (error) {
            console.error("Error creating order:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return formData.items.reduce((total, item) => total + (item.requestQuantity * item.costUnitBase), 0);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Icon icon="mdi:package-down" className="text-3xl text-blue-600"/>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tạo Đơn Yêu Cầu Nhập Hàng</h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">Tạo yêu cầu nhập hàng mới cho kho</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thông Tin Đơn
                                    Hàng</h2>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <Select
                                    label="Kho hàng"
                                    placeholder="Chọn kho"
                                    selectedKeys={formData.warehouse ? [formData.warehouse] : []}
                                    onSelectionChange={(keys) => {
                                        const warehouseId = Array.from(keys)[0]?.toString();
                                        setFormData(prev => ({...prev, warehouse: warehouseId}));
                                    }}>
                                    {/*{warehouses.map((w) => (*/}
                                    {/*    <SelectItem key={w.id}>{w.name}</SelectItem>*/}
                                    {/*))}*/}
                                </Select>

                                <Textarea
                                    label="Mô tả đơn hàng"
                                    placeholder="Nhập mô tả cho đơn nhập hàng..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                />
                            </CardBody>
                        </Card>

                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thêm Sản Phẩm</h2>
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
                                            if (product) setCurrentItem(prev => ({
                                                ...prev,
                                                product: productId,
                                                productName: product.productName
                                            }));
                                        }}>
                                        {products.map((p: { productId: Key | null | undefined; productName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                                            <SelectItem key={p.productId}>{p.productName}</SelectItem>))}
                                    </Select>

                                    <Select
                                        label="Nhà cung cấp"
                                        placeholder="Chọn nhà cung cấp"
                                        selectedKeys={currentItem.supplier ? [currentItem.supplier] : []}
                                        onSelectionChange={(keys) => {
                                            const supplierId = Array.from(keys)[0]?.toString();
                                            const supplier = suppliers.find(s => s.supplierId === supplierId);
                                            if (supplier) setCurrentItem(prev => ({
                                                ...prev,
                                                supplier: supplierId,
                                                supplierName: supplier.supplierName
                                            }));
                                        }}>
                                        {suppliers.map((s: { supplierId: Key | null | undefined; supplierName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                                            <SelectItem key={s.supplierId}>{s.supplierName}</SelectItem>))}
                                    </Select>

                                    <Select
                                        label="Đơn vị"
                                        placeholder="Chọn đơn vị"
                                        selectedKeys={currentItem.unit ? [currentItem.unit] : []}
                                        onSelectionChange={(keys) => {
                                            const unitId = Array.from(keys)[0]?.toString();
                                            const unit = units.find((u: { unitId: string; }) => u.unitId === unitId);
                                            if (unit) setCurrentItem(prev => ({
                                                ...prev,
                                                unit: unitId,
                                                unitName: unit.unitName
                                            }));
                                        }}>
                                        {units.map((u: { unitId: Key | null | undefined; unitName: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (<SelectItem key={u.unitId}>{u.unitName}</SelectItem>))}
                                    </Select>

                                    <Input
                                        type="number"
                                        label="Số lượng"
                                        placeholder="0"
                                        value={currentItem.requestQuantity.toString()}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, requestQuantity: parseInt(e.target.value) || 0 }))}
                                    />

                                    <Input
                                        type="number"
                                        label="Giá nhập (VNĐ)"
                                        placeholder="0"
                                        value={currentItem.costUnitBase.toString()}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, costUnitBase: parseFloat(e.target.value) || 0 }))}
                                    />

                                    <Input
                                        type="date"
                                        label="Ngày hết hạn"
                                        value={currentItem.expiryDate || ""}
                                        onChange={(e) => setCurrentItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                                    />
                                </div>

                                <Textarea
                                    label="Ghi chú"
                                    placeholder="Ghi chú cho sản phẩm..."
                                    value={currentItem.note || ""}
                                    onChange={(e) => setCurrentItem(prev => ({ ...prev, note: e.target.value }))}
                                />

                                <Button
                                    color="primary"
                                    startContent={<Icon icon="mdi:plus" />}
                                    onClick={(e) => { e.preventDefault(); handleAddItem(); }}
                                    isDisabled={!currentItem.product || !currentItem.supplier || currentItem.requestQuantity <= 0}
                                >
                                    Thêm Sản Phẩm
                                </Button>
                            </CardBody>
                        </Card>

                        {formData.items.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Danh Sách Sản Phẩm ({formData.items.length})</h2>
                                </CardHeader>
                                <CardBody>
                                    <Table>
                                        <TableHeader>
                                            <TableColumn>Sản phẩm</TableColumn>
                                            <TableColumn>Nhà cung cấp</TableColumn>
                                            <TableColumn>Số lượng</TableColumn>
                                            <TableColumn>Đơn giá</TableColumn>
                                            <TableColumn>Thành tiền</TableColumn>
                                            <TableColumn>Thao tác</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {formData.items.map(item => (
                                                <TableRow key={item.itemId}>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell>{item.supplierName}</TableCell>
                                                    <TableCell><Chip size="sm" variant="flat">{item.requestQuantity} {item.unitName}</Chip></TableCell>
                                                    <TableCell>{item.costUnitBase.toLocaleString('vi-VN')} ₫</TableCell>
                                                    <TableCell><span className="font-semibold">{(item.requestQuantity * item.costUnitBase).toLocaleString('vi-VN')} ₫</span></TableCell>
                                                    <TableCell>
                                                        <Button isIconOnly size="sm" color="danger" variant="light" onClick={() => handleRemoveItem(item.itemId)}>
                                                            <Icon icon="mdi:delete" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    <Divider className="my-4" />
                                    <div className="text-right font-semibold text-lg text-gray-700 dark:text-gray-200">
                                        Tổng cộng: {calculateTotal().toLocaleString('vi-VN')} ₫
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardBody>
                                <Button
                                    color="primary"
                                    className="w-full"
                                    isLoading={loading}
                                    onClick={handleSubmit}
                                    isDisabled={formData.items.length === 0 || !formData.warehouse}
                                >
                                    Gửi Yêu Cầu Nhập Hàng
                                </Button>
                            </CardBody>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    );
}
