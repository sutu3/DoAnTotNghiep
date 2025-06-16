import TableUI from "@/components/UI/Table/TableUI.tsx";
import { columns, objects } from "@/Data/User/Data.tsx";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import {useState} from "react";
import UserForm from "@/components/Form/UserForm.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import {IdCard} from "lucide-react";
import {warehouse} from "@/Store/Selector.tsx";
import {useSelector} from "react-redux";
export interface UserCreate {
        userName: string;
        fullName: string;
        email: string;
        urlImage: string;
        phoneNumber: string;
        warehouses: string;
    };

const User = () => {
    console.log(useSelector(warehouse))
    const [isOpen, setIsOpen] = useState(false);
    const [idShow, setIdShow] = useState<String>("");
    const [formData, setFormData] = useState({
        userName:  "",
        fullName:  "",
        email:  "",
        urlImage:  "",
        phoneNumber:  "",
        warehouses:  "",
    });
    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }
    const isSidebarCollapsed = localStorage.getItem("theme") != "light";
    const INITIAL_VISIBLE_COLUMNS = ["userName","fullName","email","phoneNumber","", "status", "actions"];
    const handleOpenModel=()=>{
        setIsOpen(!isOpen);
    }
    const handleOnGetId=(data:string)=>{
        setIdShow(data);
    }
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                    </div>


                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            User Page
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your employee.
                        </p>
                    </div>
                </div>

                {/* 4. Phần Nội dung - TableUI trong một "card" */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            Employee List
                        </h2>

                    </div>

                    <div className="p-0 md:p-4">
                        <TableUI
                            onchange={handleOpenModel}
                            columns={columns}
                            onGetId={(item)=>handleOnGetId(item)}
                            isDarkMode={isSidebarCollapsed}
                            objects={objects}
                            visibleColumn={INITIAL_VISIBLE_COLUMNS}
                            getId={(item) => item.id}
                        />
                    </div>
                </div>
            </div>
            <ModalUI
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title="Thêm Mới nhân viên"
                children={<UserForm data={formData} onChange={handleChange}/>}
                footer={<ButtonUI className={"bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"} startContent={<IdCard />} label={"Add Employee"} loading={false}/>}
            />
        </div>
    );
};

export default User;
