import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI";

const UserHeader = () => (
    <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
            <BreadcrumbsUI isDarkMode={localStorage.getItem("theme") === "light"} />
        </div>
        <div className="sm:text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                User Page
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Quản lý nhân sự kho hàng.
            </p>
        </div>
    </div>
);

export default UserHeader;