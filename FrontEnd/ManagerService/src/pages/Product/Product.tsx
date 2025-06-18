import TableUI from "@/components/UI/Table/TableUI.tsx";
import { columns, objects } from "@/Data/Product/Data.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";

const Product = () => {
  const isSidebarCollapsed =
    localStorage.getItem("theme") != "light" ? true : false;
  const INITIAL_VISIBLE_COLUMNS = [
    "productName",
    "skuCode",
    "status",
    "actions",
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* 3. Phần Header của trang - ĐÃ CẬP NHẬT */}
        <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          {/* Bên trái: Breadcrumbs */}
          <div>
            <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
          </div>

          <div className="sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
              Product Page
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your products efficiently.
            </p>
          </div>
        </div>

        {/* 4. Phần Nội dung - TableUI trong một "card" */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              Product List
            </h2>
            {/* Bạn có thể thêm các nút hành động khác cho bảng ở đây nếu cần, */}
            {/* ví dụ như nút "Add New" nếu nó không phải là một phần của TableUI */}
          </div>

          <div className="p-0 md:p-4">
            <TableUI
              columns={columns}
              getId={(objects) =>
                String(objects?.userId || objects?.stackId || objects?.id || "")
              }
              isDarkMode={isSidebarCollapsed}
              objects={objects}
              pageNumber={1}
              pageSize={10}
              totalPage={1}
              visibleColumn={INITIAL_VISIBLE_COLUMNS}
              onGetId={() => {}}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
