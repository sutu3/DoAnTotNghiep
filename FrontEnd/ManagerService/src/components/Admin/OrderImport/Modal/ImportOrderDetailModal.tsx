import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    CardHeader,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip, Avatar
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { getStatusColor, getStatusText } from "@/Utils/statusHelpers.tsx";
import {ImportOrder, ImportOrderItem} from "@/pages/ExecuteImport/Store/ImportOrder.tsx";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import { MiddleGetAllOrderItem} from "@/pages/ExecuteImport/Store/Thunk/ImportOrderThunk.tsx";
import {OrderItemSelector} from "@/Store/Selector.tsx";

interface ImportOrderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedOrder: ImportOrder | null;
    onApprove: (orderId: string) => void;
    onReject: (order: ImportOrder) => void;
    onItemClick: (item: ImportOrderItem) => void;
    onMarkGoodsArrived: (orderId: string) => void;
}

export default function ImportOrderDetailModal({onMarkGoodsArrived,
                                                   isOpen,
                                                   onClose,
                                                   selectedOrder,
                                                   onApprove,
                                                   onReject,
                                                   onItemClick
                                               }: ImportOrderDetailModalProps) {
    const dispatch = useDispatch();
    const items:ImportOrderItem[]=useSelector(OrderItemSelector);
    console.log(items);
    useEffect(() => {
        if(selectedOrder?.importOrderId!=null)
        {
            const fetchData = async () => {
                await (dispatch as any)(MiddleGetAllOrderItem(selectedOrder?.importOrderId));
            };
            fetchData();
        }

    },[selectedOrder])
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="5xl">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <Icon icon="mdi:file-document-outline" className="text-2xl text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Chi Tiết Yêu Cầu Nhập Hàng
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Mã đơn: #{selectedOrder?.importOrderId.slice(-8)}
                            </p>
                        </div>
                    </div>
                </ModalHeader>

                <ModalBody className="p-2 space-y-2 max-h-[80vh] overflow-y-auto">
                    {selectedOrder && (
                        <>
                            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                                <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Icon icon="mdi:information-outline" className="text-blue-600" />
                                        Thông Tin Đơn Hàng
                                    </h4>
                                </CardHeader>
                                <CardBody className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Mã đơn:</span>
                                                <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          {selectedOrder.importOrderId}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Ngày tạo:</span>
                                                <span className="font-medium">
                          {new Date(selectedOrder.requestDate).toLocaleString('vi-VN')}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Người tạo:</span>
                                                <div className="flex items-center gap-2">
                                                    {selectedOrder?.createByUser?
                                                        <Avatar size="sm" isBordered color="primary" src={`https://dummyimage.com/300.png/09f/fff&text=${selectedOrder?.createByUser?.userName}`} />
                                                        :
                                                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                            <Icon icon="mdi:account" className="text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                    }
                                                    <span className="font-medium">{selectedOrder?.createByUser?.userName}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                                                <Chip
                                                    color={getStatusColor(selectedOrder.status)}
                                                    variant="flat"
                                                    size="sm"
                                                    startContent={
                                                        selectedOrder.status === "Created" ? <Icon icon="mdi:clock-outline" className="text-xs" /> :
                                                            selectedOrder.status === "InProgress" ? <Icon icon="mdi:loading" className="text-xs animate-spin" /> :
                                                                selectedOrder.status === "Completed" ? <Icon icon="mdi:check-circle" className="text-xs" /> :
                                                                    <Icon icon="mdi:close-circle" className="text-xs" />
                                                    }
                                                >
                                                    {getStatusText(selectedOrder.status)}
                                                </Chip>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Tổng giá trị:</span>
                                                <span className="font-bold text-lg text-green-600 dark:text-green-400">
                          {selectedOrder.totalPrice?.toLocaleString('vi-VN')} ₫
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 dark:text-gray-400">Số sản phẩm:</span>
                                                <Chip size="sm" variant="flat" color="primary">
                                                    {selectedOrder?.itemCount || 0} items
                                                </Chip>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {selectedOrder.description && (
                                <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                                    <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                                        <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                            <Icon icon="mdi:text-box-outline" className="text-blue-600" />
                                            Mô Tả
                                        </h4>
                                    </CardHeader>
                                    <CardBody>
                                        <p className="text-gray-700 h-16 dark:text-gray-300 leading-relaxed">
                                            {selectedOrder.description}
                                        </p>
                                    </CardBody>
                                </Card>
                            )}

                            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                                <CardHeader className="pb-3 bg-gray-50 dark:bg-gray-800">
                                    <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                        <Icon icon="mdi:package-variant" className="text-blue-600" />
                                        Danh Sách Sản Phẩm
                                        <Chip size="sm" variant="flat" color="primary" className="ml-2">
                                            {selectedOrder.items?.length || 0} items
                                        </Chip>
                                    </h4>
                                </CardHeader>
                                <CardBody className="p-0">
                                    <Table
                                        removeWrapper
                                        classNames={{
                                            th: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold",
                                            td: "py-4 border-b border-gray-100 dark:border-gray-700",
                                        }}
                                    >
                                        <TableHeader>
                                            <TableColumn>SẢN PHẨM</TableColumn>
                                            <TableColumn>NHÀ CUNG CẤP</TableColumn>
                                            <TableColumn>SỐ LƯỢNG</TableColumn>
                                            <TableColumn>ĐƠN GIÁ</TableColumn>
                                            <TableColumn>THÀNH TIỀN</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            {items?.map((item) => (
                                                <TableRow
                                                    key={item.itemId}
                                                    onClick={() => onItemClick(item)}
                                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                                {item?.product?
                                                                    <Avatar size="sm" isBordered color="primary" src={item?.product.urlImageProduct} />
                                                                    :
                                                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                                                        <Icon icon="mdi:cube-outline" className="text-blue-600 dark:text-blue-400" />
                                                                    </div>
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-800 dark:text-white">
                                                                    {item.product?.productName}
                                                                </p>
                                                                {item.note && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                        {item.note}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                            <span className="text-gray-700 dark:text-gray-300">
                              {item.supplier.supplierName}
                            </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="sm" variant="flat" color="default">
                                                            {item.requestQuantity} {item.unit.unitName}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>
                            <span className="font-medium">
                              {item.costUnitBase.toLocaleString('vi-VN')} ₫
                            </span>
                                                    </TableCell>
                                                    <TableCell>
                            <span className="font-semibold text-green-600 dark:text-green-400">
                              {(item.requestQuantity * item.costUnitBase).toLocaleString('vi-VN')} ₫
                            </span>
                                                    </TableCell>
                                                    {/*<TableCell>*/}
                                                    {/*    <Button*/}
                                                    {/*        size="sm"*/}
                                                    {/*        variant="light"*/}
                                                    {/*        color="primary"*/}
                                                    {/*        startContent={<Icon icon="mdi:chart-box" />}*/}
                                                    {/*    >*/}
                                                    {/*        Xem thống kê*/}
                                                    {/*    </Button>*/}
                                                    {/*</TableCell>*/}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </>
                    )}
                </ModalBody>

                <ModalFooter className="border-t border-gray-200 dark:border-gray-700">
                    {selectedOrder?.status === "InProgress" && (
                        <Button
                            size="sm"
                            color="success"
                            variant="flat"
                            onClick={() => onMarkGoodsArrived(selectedOrder.importOrderId)}
                        >
                            Hàng đã đến
                        </Button>
                    )}
                    {selectedOrder?.status === "Created" && (
                        <>
                            <Button color="success" startContent={<Icon icon="mdi:check" />} onClick={() => onApprove(selectedOrder.importOrderId)}>
                                Duyệt đơn
                            </Button>
                            <Button color="danger" variant="light" startContent={<Icon icon="mdi:close" />} onClick={() => { onReject(selectedOrder); onClose(); }}>
                                Từ chối đơn
                            </Button>
                        </>
                    )}
                    <Button variant="light" onClick={onClose}>
                        Đóng
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
