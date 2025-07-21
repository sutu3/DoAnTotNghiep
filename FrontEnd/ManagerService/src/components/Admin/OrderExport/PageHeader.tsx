import { Icon } from "@iconify/react";

export default function PageHeader() {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <Icon icon="mdi:package-up" className="text-3xl text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Thực Hiện Xuất Hàng
                </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
                Xử lý và thực hiện các đơn xuất hàng đã được phê duyệt
            </p>
        </div>
    );
}