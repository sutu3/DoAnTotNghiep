import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import {ImportOrder} from "@/Store/ImportOrder.tsx";

interface ImportOrderInfoProps {
    importOrder: ImportOrder;
}

export default function ImportOrderInfo({ importOrder }: ImportOrderInfoProps) {
    if (!importOrder) return null;

    return (
        <Card className="mb-6">
            <CardHeader>
                <h2 className="text-xl font-semibold">Thông Tin Đơn Hàng</h2>
            </CardHeader>
            <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <p className="font-semibold">{importOrder.importOrderId}</p>
                    </div>
                    <div>
                        <span className="text-gray-600">Kho:</span>
                        <p className="font-semibold">{importOrder.warehouse?.warehouseName}</p>
                    </div>
                    <div>
                        <span className="text-gray-600">Trạng thái:</span>
                        <Chip color="warning" variant="flat">Đang thực hiện</Chip>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}