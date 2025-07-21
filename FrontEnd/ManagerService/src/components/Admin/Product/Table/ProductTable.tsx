import  {useEffect, useMemo, useState} from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    Pagination,
    Chip,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem, Spinner
} from '@heroui/react';
import { Icon } from '@iconify/react';
import ProductSlice, { Product } from '@/Store/ProductSlice';
import {useDispatch, useSelector} from "react-redux";
import {ProductSelector, TotalPageProduct} from "@/Store/Selector.tsx";
import {pageApi} from "@/Api/UrlApi.tsx";
import {MiddleGetAllProduct} from "@/Store/Thunk/ProductThunk.tsx";





const ProductTable = () => {
    const [filterValue, setFilterValue] = useState("");
    const products=useSelector(ProductSelector)
    const dispatch = useDispatch();
    const pageProduct=useSelector(TotalPageProduct);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const PageApi: pageApi = { pageNumber: page - 1, pageSize: rowsPerPage };
            dispatch(ProductSlice.actions.setProductList([]));

            try {
                await (dispatch as any)(MiddleGetAllProduct(PageApi));
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [page, rowsPerPage]);
    const filteredItems = useMemo(() => {
        let filteredProducts = [...products];

        if (filterValue) {
            filteredProducts = filteredProducts.filter((product) =>
                product.productName.toLowerCase().includes(filterValue.toLowerCase()) ||
                product.sku.toLowerCase().includes(filterValue.toLowerCase())
            );
        }

        return filteredProducts;
    }, [products, filterValue]);
    // useEffect(() => {
    //     console.log("Filter Value:", pageProduct);
    //     setPage(pageProduct)
    // }, [pageProduct]);
    const pages = pageProduct;

    const items = useMemo(() => {
        return filteredItems.slice(0, rowsPerPage);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = (product: Product, columnKey: string) => {
        switch (columnKey) {
            case "product":
                return (
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={product.urlImageProduct}
                            size="sm"
                            className="flex-shrink-0"
                        />
                        <div>
                            <p className="font-semibold">{product.productName}</p>
                            <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                    </div>
                );
            case "createByUser": // Consolidated the duplicate warehouseName case
                return <span className="text-blue-400">{product?.createByUser?.userName ?? "N/A"}</span>;
            case "supplier":
                return <span className={""}>{product?.supplier?.supplierName ?? "N/A"}</span>;
            case "category":
                return <span className={""}>{product?.category?.categoryName ?? "N/A"}</span>;
            case "unit":
                return <span className={""}>{product?.unit?.unitName ?? "N/A"}</span>;
            case "price":
                return (
                    <span className="font-semibold text-green-600">
                        {product.price.toLocaleString('vi-VN')} VNĐ
                    </span>
                );
            case "status":
                return (
                    <Chip
                        color={product.isActive ? "success" : "danger"}
                        variant="flat"
                        size="sm"
                    >
                        {product.isActive ? "Hoạt động" : "Tạm dừng"}
                    </Chip>
                );
            case "actions":
                return (
                    <Dropdown>
                        <DropdownTrigger>
                            <Button isIconOnly size="sm" variant="light">

                                <Icon icon="mdi:dots-vertical" />

                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem key="view">Xem chi tiết</DropdownItem>
                            <DropdownItem key="edit">Chỉnh sửa</DropdownItem>
                            <DropdownItem key="delete" className="text-danger">
                                Xóa
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                );
            default:
                return product[columnKey as keyof Product];
        }
    };

    const topContent = (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
                <Input
                    isClearable
                    className="w-full sm:max-w-[44%]"
                    placeholder="Tìm kiếm theo tên hoặc SKU..."
                    startContent={<Icon icon="mdi:magnify" />}
                    value={filterValue}
                    onClear={() => setFilterValue("")}
                    onValueChange={setFilterValue}
                />
            </div>
            <div className="flex justify-between items-center">
                <span className="text-default-400 text-small">
                    Tổng {filteredItems.length} sản phẩm
                </span>
                <label className="flex items-center text-default-400 text-small">
                    Số dòng mỗi trang:
                    <select
                        className="bg-transparent outline-none text-default-400 text-small ml-2"
                        onChange={(e) => {
                            setPage(1)
                            setRowsPerPage(Number(e.target.value))
                        }}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                </label>
            </div>
        </div>
    );

    const bottomContent = (
        <div className="py-2 px-2 flex justify-between items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    );

    return (
        <Table
            aria-label="Bảng danh sách sản phẩm"
            isHeaderSticky
            classNames={{
                table: "min-h-[500px]",
            }}
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            topContent={topContent}
            topContentPlacement="outside"
        >
            <TableHeader>
                <TableColumn key="product">SẢN PHẨM</TableColumn>
                <TableColumn key="category">DANH MỤC</TableColumn>
                <TableColumn key="supplier">NHÀ CUNG CẤP</TableColumn>
                <TableColumn key="unit">ĐƠN VỊ</TableColumn>
                <TableColumn key="price">GIÁ</TableColumn>
                <TableColumn key="status">TRẠNG THÁI</TableColumn>
                <TableColumn key="actions">THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody
                isLoading={loading}
                loadingContent={<Spinner label="Loading..." />}
                items={items}>
                {(item:Product) => (
                    <TableRow key={item.productId}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item,columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default ProductTable;