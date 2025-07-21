
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import ProductTable from "@/components/Admin/Product/Table/ProductTable.tsx";

const ProductListPage = () => {
    const navigate = useNavigate();



    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Quản Lý Sản Phẩm
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Danh sách tất cả sản phẩm trong hệ thống
                    </p>
                </div>
                <Button
                    color="primary"
                    startContent={<Icon icon="mdi:plus" />}
                    onClick={() => navigate('/admin/products/addnew')}
                >
                    Thêm Sản Phẩm
                </Button>
            </div>

            <ProductTable />
        </div>
    );
};

export default ProductListPage;