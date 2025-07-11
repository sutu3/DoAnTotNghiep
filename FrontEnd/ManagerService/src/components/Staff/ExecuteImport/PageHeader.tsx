import { Icon } from "@iconify/react";

export default function PageHeader() {
    return (
        <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
                <Icon icon="mdi:package-check" className="text-3xl text-green-600"/>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Thực Hiện Nhập Hàng
                </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
                Kiểm tra và nhập hàng vào kho
            </p>
        </div>
    );
}