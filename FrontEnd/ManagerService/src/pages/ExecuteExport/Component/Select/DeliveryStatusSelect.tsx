import {Select, SelectItem} from "@heroui/react";
import {Icon} from "@iconify/react";

interface DeliveryStatusSelectProps {
    selectedStatus: string;
    onStatusChange: (status: string) => void;
    className?: string;
}


export default function DeliveryStatusSelect({
                                                 selectedStatus,
                                                 onStatusChange,
                                                 className = ""
                                             }: DeliveryStatusSelectProps) {

    const deliveryStatuses = [
        {key: "all", label: "Tất cả trạng thái", icon: "mdi:format-list-bulleted"},
        {key: "PENDING", label: "Chờ xử lý", icon: "mdi:clock-outline"},
        {key: "IN_PROGRESS", label: "Đang xử lý", icon: "mdi:loading"},
        {key: "COMPLETED", label: "Hoàn thành", icon: "mdi:check-circle"}
    ];

    return (
        <Select
            aria-labelledby="Input"
            label="Trạng thái phiếu xuất"
            placeholder="Chọn trạng thái"
            selectedKeys={[selectedStatus]}
            onSelectionChange={(keys) => {
                const status = Array.from(keys)[0]?.toString() || "all";
                onStatusChange(status);
            }}
            className={`w-full sm:max-w-[200px] ${className}`}
            size="sm"
            variant="bordered"
            startContent={<Icon icon="mdi:truck-delivery" className="text-orange-600"/>}
        >
            {deliveryStatuses.map((status) => (
                <SelectItem aria-labelledby="Input"
                            key={status.key} value={status.key||""}>
                    <div className="flex items-center gap-2">
                        <Icon
                            icon={status.icon}
                            className={`  
                                ${status.key === "PENDING" ? "text-warning" : ""}  
                                ${status.key === "IN_PROGRESS" ? "text-primary animate-spin" : ""}  
                                ${status.key === "COMPLETED" ? "text-success" : ""}  
                                ${status.key === "all" ? "text-gray-500" : ""}  
                            `}
                        />
                        <span>{status.label}</span>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
}