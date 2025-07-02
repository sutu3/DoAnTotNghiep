import { useState} from "react";
import { IdCard } from "lucide-react";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import TableUI from "@/components/Admin/Product/Table/TableUI.tsx";



const ProductPage = () => {
    // console.log(useSelector(warehouse));
    const [isOpen, setIsOpen] = useState(false);
    // const [idShow, setIdShow] = useState<String>("");

    const isSidebarCollapsed = localStorage.getItem("theme") == "light";

    /* const handleOpenModel = () => {
         setIsOpen(!isOpen);
     };*/
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                    </div>

                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Group Supplier Page
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your Supplier.
                        </p>
                    </div>
                </div>

                {/* 4. Phần Nội dung - TableUI trong một "card" */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            Group Supplier List
                        </h2>
                    </div>
                    <div className="p-0 md:p-4">
                        <TableUI
                            key={""}
                            setKey={()=>{}} />
                    </div>
                </div>
            </div>
            <ModalUI
                footer={
                    <ButtonUI
                        className="relative z-0 font-medium text-black px-5 py-2 rounded-full overflow-hidden
             border border-transparent
             before:content-[''] before:absolute before:inset-0 before:rounded-full
             before:border before:border-transparent before:bg-gradient-to-r
             before:from-pink-500 before:to-purple-500
             before:z-[-1]"
                        label="Add new"
                        loading={false}
                        startContent={<IdCard />}
                        variant = {undefined}
                    />


                }
                size={"2xl"}
                isOpen={isOpen}
                title="User From"
                onOpenChange={setIsOpen}
            >
                {/*
                <UserForm data={formData} onChange={handleChange} />
*/}
            </ModalUI>
        </div>
    );
};

export default ProductPage;
