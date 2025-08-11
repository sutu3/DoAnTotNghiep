"use client";

import  { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {UnitSelector, TotalPageUnit, GroupUnitSelector} from "@/Store/Selector.tsx";
import { MiddleGetAllUnit } from "@/Store/Thunk/UnitThunk.tsx";
import { pageApi } from "@/Api/UrlApi.tsx";
import {useSearchParams} from "react-router-dom";
import UnitSlice, {Unit, UnitCreate} from "@/Store/Unit.tsx";
import UnitTableSection from "@/components/Admin/Unit/UnitTableSection.tsx";
import UnitThumbnail from "@/components/Admin/Unit/UnitThumbnail";
import UnitModal from "@/components/Admin/Unit/Modal/UnitModal.tsx";

const UnitPage = () => {
    const dispatch = useDispatch();
    const units = useSelector(UnitSelector);
    const totalPage = useSelector(TotalPageUnit);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<UnitCreate>({
        unitName: "",
        shortName: "",
        RatioToBase: 1,
        IsDefault: false,
        groupUnit: ""
    });
    const [searchParams]=useSearchParams()
    const groupUnitName = searchParams.get("groupUnitName")||"";
    const object=useSelector(GroupUnitSelector)
        .find((groupUnit: { groupName: string; })=> groupUnit.groupName==groupUnitName)
    const isDarkMode = localStorage.getItem("theme") === "dark";

    useEffect(() => {
        dispatch(UnitSlice.actions.setUnitList([]))
        const PageApi: pageApi = { pageNumber: page - 1, pageSize: 10 };
        const fetch=async ()=>{
            setLoading(true);

            await (dispatch as any)(MiddleGetAllUnit(PageApi,object.groupName));
            setLoading(false);
        }
        fetch()
    }, [page, dispatch]);

    useEffect(() => {
        if (units && units.length > 0 && !selectedUnit) {
            setSelectedUnit(units[0]);
        }
    }, [units, selectedUnit]);

    const handleUnitSelect = (unitId: string) => {
        const unit = units.find((u: Unit) => u.unitID === unitId);
        if (unit) {
            setSelectedUnit(unit);
        }
    };

    const handleOpenModal = (open: boolean) => {
        setIsModalOpen(open);
    };

    const handleFormChange = (key: string, value: string | number | boolean) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                    <div>
                        <BreadcrumbsUI isDarkMode={isDarkMode} />
                    </div>
                    <div className="sm:text-right">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Quản lý đơn vị đo lường
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Chọn đơn vị để xem thông tin chi tiết
                        </p>
                    </div>
                </div>

                {/* Layout 2 cột */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Bên trái: Unit Table (2/3) */}
                    <div className="lg:col-span-2">
                        <UnitTableSection
                            loading={loading}
                            selectedUnit={selectedUnit}
                            onUnitClick={handleUnitSelect}
                            onOpenModal={handleOpenModal}
                            isModalOpen={isModalOpen}
                            units={units}
                            totalPage={totalPage}
                            currentPage={page}
                            onPageChange={setPage}
                        />
                    </div>

                    {/* Bên phải: Unit Thumbnail (1/3) */}
                    <div className="lg:col-span-1">
                        <UnitThumbnail unit={selectedUnit} />
                    </div>
                </div>
            </div>

            {/* Modal */}
            <UnitModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                formData={formData}
                onFormChange={handleFormChange}
            />
        </div>
    );
};

export default UnitPage;