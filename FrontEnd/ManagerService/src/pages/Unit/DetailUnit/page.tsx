"use client";

import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import TableUI from "@/components/Admin/UnitType/Table/TableUI.tsx";
import {useSelector} from "react-redux";
import {GroupUnitSelector, warehouseSelector} from "@/Store/Selector.tsx";
import {useSearchParams} from "react-router-dom";
import { GroupUnitCreate} from "@/Store/GroupUnit.tsx";
import {useState} from "react";
import {Textarea} from "@heroui/input";
import {Select, SelectItem} from "@heroui/react";
import FormInput from "@/components/Admin/UnitType/Input/InputText.tsx";
import ModalUnit from "@/components/Admin/UnitType/Modal/ModalUI.tsx";

export const Type = [
    {key: "Weight", label: "Weight"},
    {key: "Volume", label: "Volume"},
    {key: "Length", label: "Length"},
    {key: "Quantity", label: "Quantity"},
];

const DetailUnit = () => {

    const isDarkMode = localStorage.getItem("theme") === "dark";
    const [searchParams]=useSearchParams()
    const groupUnitName = searchParams.get("groupUnitName")||"";
    const object=useSelector(GroupUnitSelector).find((groupUnit: { groupName: string; })=>
        groupUnit.groupName==groupUnitName)
    const [open, setOpen] = useState(false);
    const [groupEdit,setGroupEdit]=useState<GroupUnitCreate>(object);
const warehouse=useSelector(warehouseSelector);
    const handleInputChange = (key: keyof GroupUnitCreate, value: string | number) => {
        setGroupEdit((prev) => ({ ...prev, [key]: value }));
    };


    return (
        <div className="min-h-screen dark:bg-gray-900  bg-background p-4 md:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <BreadcrumbsUI isDarkMode={isDarkMode} />
                    <div className="text-left md:text-right">
                        <h1 className="text-2xl md:text-3xl font-bold text-foreground  dark:text-gray-100">Stack Page</h1>
                        <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">Manage and monitor Unit.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <div className="bg-card dark:bg-gray-800 shadow-md rounded-lg border border-border">
                            <div className="px-6 py-4 border-b border-border  dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-foreground dark:text-gray-200">Stack List</h2>
                            </div>
                            <div className="p-6">
                                <div className="text-center text-muted-foreground italic">
                                    <TableUI open={open} setOpen={setOpen}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-card shadow-md rounded-lg border border-border dark:bg-gray-800">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-foreground">Group Details</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <FormInput
                                            label="Group Name"
                                            value={groupEdit.groupName}
                                            onChange={(val) => handleInputChange("groupName",
                                                val)}
                                            type="text"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Unit Type</label>
                                        <Select
                                            aria-labelledby="Input"
                                            className="w-full"
                                            selectedKeys={[groupEdit.unitType]}
                                            onSelectionChange={(key) => handleInputChange("unitType", String(Array.from(key)[0]))}
                                        >
                                            {Type.map((animal) => (
                                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                    <div>
                                        <FormInput
                                            aria-labelledby="Input"
                                            label="Ratio to Base"
                                            value={groupEdit.baseUnitRatio}
                                            onChange={(val) => handleInputChange("baseUnitRatio",
                                                parseFloat(val))}
                                            type="number"
                                        />
                                    </div>

                                    <div>
                                        <FormInput
                                            aria-labelledby="Input"
                                            label="Warehouse Name"
                                            readOnly={true}
                                            value={warehouse.warehouseName}
                                            onChange={() => {}}
                                            type="text"
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Description</label>
                                        <Textarea
                                            aria-labelledby="Input"
                                            className="max-w-xs"
                                            variant="faded"
                                            value={groupEdit.description}
                                            onChange={(e) => handleInputChange("description", e.target.value)}
                                            placeholder="Enter your description"
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <ModalUnit open={open} setOpen={setOpen}/>
                </div>
            </div>
        </div>
    );
};

export default DetailUnit;
