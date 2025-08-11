import {useEffect, useState} from "react";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {useDispatch} from "react-redux";
import {pageApi} from "@/Api/UrlApi.tsx";
import {MiddleGetAllGroupUnit} from "@/Store/Thunk/GroupUnitThunk.tsx";
import TableUI from "@/components/Admin/Unit/Table/TableUI.tsx";
import {setUnitGroup} from "@/Store/GroupUnit.tsx";



const GroupUnit = () => {
    const dispatch = useDispatch();
const [loading, setLoading] = useState(false);
    const isSidebarCollapsed = localStorage.getItem("theme") == "light";


    useEffect(() => {
        const PageApi: pageApi = { pageNumber: 0, pageSize:  5 };
        const fetch=async ()=>{
            dispatch(setUnitGroup([]));
            setLoading(true);
            await (dispatch as any)(MiddleGetAllGroupUnit(PageApi));
            setLoading(false);
        }
        fetch();
    },[])
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isSidebarCollapsed} />
                    </div>

                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Group Unit Page
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage your Group Unit.
                        </p>
                    </div>
                </div>

                {/* 4. Phần Nội dung - TableUI trong một "card" */}
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                            Group Unit List
                        </h2>
                    </div>

                    <div className="p-0 md:p-4">
                        <TableUI loading={loading} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupUnit;
