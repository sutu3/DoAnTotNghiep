import { Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";
import { ExportOrder } from "@/pages/ExecuteExport/Store/ExportOrderSlice.tsx";

interface ExportStatsCardsProps {
    exportOrders: ExportOrder[];
}

export default function ExportStatsCards({ exportOrders }: ExportStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
                <CardBody className="text-center">
                    <Icon icon="mdi:clock-outline" className="text-2xl text-warning mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Chờ xuất</p>
                    <p className="text-2xl font-bold text-warning">
                        {exportOrders.filter(o => o.status === "APPROVED").length}
                    </p>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center">
                    <Icon icon="mdi:truck-delivery" className="text-2xl text-blue-600 mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Đang giao</p>
                    <p className="text-2xl font-bold text-blue-600">
                        {exportOrders.filter(o => o.status === "IN_PROGRESS").length}
                    </p>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center">
                    <Icon icon="mdi:check-circle" className="text-2xl text-success mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Hoàn thành</p>
                    <p className="text-2xl font-bold text-success">
                        {exportOrders.filter(o => o.status === "COMPLETED").length}
                    </p>
                </CardBody>
            </Card>
            <Card>
                <CardBody className="text-center">
                    <Icon icon="mdi:calendar-today" className="text-2xl text-purple-600 mb-2 mx-auto" />
                    <p className="text-sm text-gray-600">Hôm nay</p>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                </CardBody>
            </Card>
        </div>
    );
}