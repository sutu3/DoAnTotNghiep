"use client";

import React, {useEffect, useState} from "react";
import {
    Card,
    CardBody,
    Button,
    Input,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Avatar,
    Pagination,
    Spinner,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure
} from "@heroui/react";
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Building2,
    Mail,
    Phone,
    MapPin,
    Calendar,
    TrendingUp
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SupplierSelector, TotalPageSelector } from "@/Store/Selector.tsx";
import { Supplier } from "@/Store/SupplierSlice.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {MiddleDeleteSupplier, MiddleGetAllSupplierPage} from "@/Store/Thunk/ShupplierThunk.tsx";



const SupplierManagement = () => {
    const suppliers = useSelector(SupplierSelector);
    const totalPages = useSelector(TotalPageSelector);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [viewMode, setViewMode] = useState<"table" | "grid">("table");

    // Stats calculation
    useEffect(() => {
        const PageApi: pageApi = { pageNumber: currentPage-1, pageSize:  5 };
        setLoading(true)
        const fetch=async ()=>{
            await (dispatch as any)(MiddleGetAllSupplierPage(PageApi));
            setLoading(false)
        }
        fetch();
    },[currentPage])

    // Filtered suppliers  
    const filteredSuppliers = React.useMemo(() => {
        let filtered = suppliers;

        if (searchValue) {
            filtered = filtered.filter((supplier:Supplier) =>
                supplier.supplierName.toLowerCase().includes(searchValue.toLowerCase()) ||
                supplier.email?.toLowerCase().includes(searchValue.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter((supplier:Supplier) => supplier.status === statusFilter);
        }

        return filtered;
    }, [suppliers, searchValue, statusFilter]);

    const handleEdit = (supplier: Supplier) => {
        navigate(`/admin/supplier/edit?supplierId=${supplier.supplierId}`);
    };

    const handleDelete = (supplier: Supplier) => {
        setSelectedSupplier(supplier);
        onOpen();
    };

    const handleView = (supplier: Supplier) => {
        // Navigate to detail view  
        navigate(`/admin/supplier/edit?supplierId=${supplier.supplierId}`);
    };
    const handleDeleteApprove=async ()=>{
        await(dispatch as any)(MiddleDeleteSupplier(selectedSupplier?.supplierId))
    }
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active": return "success";
            case "Inactive": return "danger";
            case "Pending": return "warning";
            default: return "default";
        }
    };

    const renderTableView = () => (
        <Card className="shadow-xl border-0">
            <Table
                aria-label="Suppliers table"
                classNames={{
                    wrapper: "shadow-none",
                    td: "border-b border-gray-100 py-4"
                }}
            >
                <TableHeader>
                    <TableColumn>NHÃN CUNG CẤP</TableColumn>
                    <TableColumn>LIÊN HỆ</TableColumn>
                    <TableColumn>ĐỊA CHỈ</TableColumn>
                    <TableColumn>TRẠNG THÁI</TableColumn>
                    <TableColumn>NGÀY TẠO</TableColumn>
                    <TableColumn align="center">THAO TÁC</TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading}
                    loadingContent={<Spinner size="lg" />}
                    emptyContent={
                        <div className="text-center py-12">
                            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Không có nhà cung cấp nào</p>
                            <p className="text-gray-400 text-sm">Thêm nhà cung cấp đầu tiên để bắt đầu</p>
                        </div>
                    }
                >
                    {filteredSuppliers.map((supplier:Supplier) => (
                        <TableRow key={supplier.supplierId} className="hover:bg-blue-50/50 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={supplier?.urlSupplier}
                                        size="md"
                                        className="flex-shrink-0"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{supplier.supplierName}</p>
                                        <p className="text-sm text-gray-500">ID: {supplier.supplierId.slice(0, 8)}...</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="w-4 h-4 text-blue-500" />
                                        <span className="text-gray-700">{supplier.email || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="w-4 h-4 text-green-500" />
                                        <span className="text-gray-700">{supplier.phoneNumber || "N/A"}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 max-w-xs">
                                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 truncate">{supplier.address || "N/A"}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    color={getStatusColor(supplier.status)}
                                    variant="flat"
                                    size="sm"
                                    className="font-medium"
                                >
                                    {supplier.status}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString('vi-VN') : "N/A"}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="light"
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Actions">
                                        <DropdownItem
                                            key="edit"
                                            startContent={<Edit className="w-4 h-4" />}
                                            onClick={() => handleEdit(supplier)}
                                        >
                                            Chỉnh sửa
                                        </DropdownItem>
                                        <DropdownItem
                                            key="delete"
                                            className="text-danger"
                                            color="danger"
                                            startContent={<Trash2 className="w-4 h-4" />}
                                            onClick={() => handleDelete(supplier)}
                                        >
                                            Xóa
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );

    const renderGridView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSuppliers.map((supplier:Supplier) => (
                <Card key={supplier.supplierId} className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 hover:scale-105">
                    <CardBody className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Avatar
                                src={supplier?.urlSupplier}
                                size="md"
                                className="flex-shrink-0"
                            />
                            <Chip
                                color={getStatusColor(supplier.status)}
                                variant="flat"
                                size="sm"
                            >
                                {supplier.status}
                            </Chip>
                        </div>

                        <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
                            {supplier.supplierName}
                        </h3>

                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="w-4 h-4" />
                                <span className="truncate">{supplier.email || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="w-4 h-4" />
                                <span>{supplier.phoneNumber || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span className="truncate">{supplier.address || "N/A"}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                className="flex-1"
                                onClick={() => handleView(supplier)}
                            >
                                Xem
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                color="danger"
                                className="flex-1"
                                onClick={() => handleDelete(supplier)}
                            >
                                Xóa
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen pt-3">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Search and Filter Section */}
                <Card className="shadow-lg border-0">
                    <CardBody className="p-6">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="flex flex-col md:flex-row gap-4 flex-1">
                                <Input
                                    placeholder="Tìm kiếm nhà cung cấp..."
                                    value={searchValue}
                                    onValueChange={setSearchValue}
                                    startContent={<Search className="w-4 h-4 text-gray-400" />}
                                    className="max-w-md"
                                    variant="bordered"
                                />

                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            startContent={<Filter className="w-4 h-4" />}
                                            className="min-w-[120px]"
                                        >
                                            {statusFilter === "all" ? "Tất cả" : statusFilter}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        selectedKeys={[statusFilter]}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as string;
                                            setStatusFilter(selected);
                                        }}
                                    >
                                        <DropdownItem key="all">Tất cả</DropdownItem>
                                        <DropdownItem key="Active">Đang hoạt động</DropdownItem>
                                        <DropdownItem key="Inactive">Không hoạt động</DropdownItem>
                                        <DropdownItem key="Pending">Đang chờ</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant={viewMode === "table" ? "solid" : "bordered"}
                                    color={viewMode === "table" ? "primary" : "default"}
                                    isIconOnly
                                    onClick={() => setViewMode("table")}
                                >
                                    <Building2 className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant={viewMode === "grid" ? "solid" : "bordered"}
                                    color={viewMode === "grid" ? "primary" : "default"}
                                    isIconOnly
                                    onClick={() => setViewMode("grid")}
                                >
                                    <TrendingUp className="w-4 h-4" />
                                </Button>

                                <Button
                                    color="primary"
                                    startContent={<Plus className="w-4 h-4" />}
                                    onClick={() => navigate("/admin/suppliers/addnew")}
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium"
                                >
                                    Thêm nhà cung cấp
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Content Section */}
                <div className="space-y-6">
                    {viewMode === "table" ? renderTableView() : renderGridView()}
                </div>

                {/* Pagination */}
                    <div className="flex justify-center">
                        <Pagination
                            total={totalPages}
                            page={currentPage}
                            onChange={setCurrentPage}
                            showControls
                            classNames={{
                                cursor: "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            }}
                        />
                    </div>
                {/* Delete Confirmation Modal */}
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            <h3 className="text-lg font-semibold">Xác nhận xóa</h3>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <Trash2 className="w-6 h-6 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Bạn có chắc chắn muốn xóa nhà cung cấp này?
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {selectedSupplier?.supplierName}
                                    </p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">
                                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Hủy
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => {
                                    handleDeleteApprove();
                                    onClose();
                                }}
                            >
                                Xóa
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
};

export default SupplierManagement;