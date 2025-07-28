
import SupplierManagement from "@/components/Admin/Supplier/Table/TableUI.tsx";
import {Building2} from "lucide-react";



const SupplierPage = () => {
    // console.log(useSelector(warehouse));
    // const [idShow, setIdShow] = useState<String>("");



    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
                <div className="text-center space-y-4">
                    <div className="flex justify-start items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Quản Lý Nhà Cung Cấp
                            </h1>
                            <p className="text-gray-600 mt-2">Quản lý thông tin và quan hệ đối tác kinh doanh</p>
                        </div>
                    </div>
                </div>
             <SupplierManagement/>
        </div>
    );
};

export default SupplierPage;
