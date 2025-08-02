import { Icon } from "@iconify/react";

export default function DeliveryHeader() {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-3 shadow-lg">
                    <Icon icon="mdi:truck-delivery" className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Tạo Phiếu Xuất Kho
                    </h1>
                    <p className="text-gray-600">
                        Tạo phiếu xuất kho từ đơn hàng đã được phê duyệt
                    </p>
                </div>
            </div>

            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Icon icon="mdi:home" className="w-4 h-4 mr-2" />
                        <span className="text-sm text-gray-500">Trang chủ</span>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-400" />
                            <span className="ml-1 text-sm text-gray-500">Xuất hàng</span>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <Icon icon="mdi:chevron-right" className="w-4 h-4 text-gray-400" />
                            <span className="ml-1 text-sm font-medium text-gray-900">Tạo phiếu xuất</span>
                        </div>
                    </li>
                </ol>
            </nav>
        </div>
    );
}