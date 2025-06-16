import {useEffect, useState} from "react";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import TableUI from "@/components/UI/Table/TableUI.tsx";
import StackSummaryPanel from "@/components/Admin/StackSummaryPanel.tsx";
import {columns, GetAllStack, MiddleAddStack, MiddleGetAllStack, StackType} from "@/Store/StackSlice.tsx";
import ButtonUI from "@/components/UI/Button/ButtonUI.tsx";
import { Layers} from "lucide-react";
import ModalUI from "@/components/UI/Modal/ModalUI.tsx";
import StackForm from "@/components/Form/StackForm.tsx";
import {useDispatch, useSelector} from "react-redux";
import {StacksSelector} from "@/Store/Selector.tsx";
import {pageApi} from "@/Constants/UrlApi.tsx";

export default function StackPage() {
    const stacks=useSelector(StacksSelector);
    const dispatch = useDispatch();
    const [selectedStack, setSelectedStack] = useState(stacks[0]);
    const INITIAL_VISIBLE_COLUMNS = ["stackName", "description","binCount", "statusStack", "actions"];
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPage, setTotalPage] = useState(1);

    useEffect(() => {
        const PageApi:pageApi={pageNumber:page,pageSize:pageSize}
        const fetchData = async () => {
            const res = dispatch(MiddleGetAllStack(PageApi))
            setTotalPage(res.totalPages); // hoặc `totalElements / pageSize`
        };
        fetchData();
    }, [page, pageSize]);
    const [formData, setFormData] = useState({
        stackName:  "",
        description:  "",
        warehouses:  "",
    });

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    }
    const isSidebarCollapsed =
        localStorage.getItem("theme") != "light";

    const handleOpenModel=()=>{
        setIsOpen(!isOpen);
    }
    const handleAddStack= async ()=>{
        console.log(formData);
        await dispatch(MiddleAddStack(formData));
        setIsOpen(false);
        setFormData({ stackName: "", description: "", warehouses: "" });
    }
    const handleStackClick = (stackId: string) => {

        const found = stacks.find((s) => s.stackId === stackId);
        if (found) setSelectedStack(found);
    };
    const stats = selectedStack
        ? {
            total: 12,
            loaded: selectedStack.bin.filter((b) => b.status === "loaded").length,
            free: selectedStack.bin.filter((b) => b.status === "free").length,
            empty: 12 - selectedStack.bin.length,
        }
        : { total: 0, loaded: 0, free: 0, empty: 0 };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header + Breadcrumb */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />

                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Stack Page
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage and monitor stacks.
                        </p>
                    </div>
                </div>

                {/* Grid 2 cột */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* LEFT: Table */}
                    <div className="md:col-span-2">
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                                    Stack List
                                </h2>
                            </div>

                            <div className="p-0 md:p-4">
                                <TableUI
                                    onchange={handleOpenModel}
                                    onGetId={(item) => handleStackClick(item)}
                                    columns={columns}
                                    isDarkMode={isSidebarCollapsed}
                                    objects={stacks}
                                    visibleColumn={INITIAL_VISIBLE_COLUMNS}
                                    getId={(item) => item.stackId}
                                    page={page} pageSize={pageSize} totalPage={totalPage}
                                    onPageChange={setTotalPage}                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Chart + Summary */}
                    <div>
                        <StackSummaryPanel stack={selectedStack} stats={stats} />
                    </div>
                </div>
            </div>

            <ModalUI
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                title="Thêm Mới nhân viên"
                children={<StackForm data={formData} onChange={handleChange}/>}
                footer={
                <ButtonUI
                    onClick={handleAddStack}
                    className={"bg-gradient-to-tr from-green-500 to-green-300 text-green-100 shadow-lg"}
                    startContent={<Layers /> }
                    label={"Add Stack"}
                    loading={false}/>}
            />
        </div>
    );
}
