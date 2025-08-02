"use client";

import React from "react";
import {Input} from "@heroui/input";
import {Calendar} from "@heroui/react";
import LevelDropdown from "@/components/Admin/Tasks/LevelDropdown.tsx";
import {parseDate} from "@internationalized/date";
import {TaskType} from "@/Store/TaskTypeSlice.tsx";
import {TaskCreated} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";


interface Props {
    data: TaskCreated,
    onChange: (key: keyof TaskCreated, value: string) => void,
    taskType?: TaskType | undefined
}


const NewTaskTypeForm: React.FC<Props> = ({data, onChange,  taskType}) => {
    const taskTypeInfo = taskType

    return (
        <div className="bg-white rounded-lg  w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Name */}
                <Input
                    label="Task Name"
                    value={taskTypeInfo?.taskName ?? ""}
                    disabled
                    type="text"
                    variant="bordered"
                    className="w-full"
                    classNames={{
                        label: "text-gray-700 dark:text-white font-medium",
                        input: [
                            "bg-transparent",
                            "text-gray-800 dark:text-white",
                            "placeholder:text-gray-400 dark:placeholder:text-white/60",
                            "text-base",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "bg-white/40 dark:bg-gray-800/40",
                            "backdrop-blur-md",
                            "border border-gray-300 dark:border-gray-600",
                            "hover:border-gray-400 dark:hover:border-gray-500",
                            "focus-within:!border-indigo-500",
                            "transition-all",
                            "h-12",
                            "!cursor-not-allowed",
                        ],
                    }}
                />

                {/* Warehouse Name */}
                <Input
                    label="Warehouse Name"
                    value={taskTypeInfo?.warehouses?.warehouseName ?? ""}
                    disabled
                    type="text"
                    variant="bordered"
                    className="w-full"
                    classNames={{
                        label: "text-gray-700 dark:text-white font-medium",
                        input: [
                            "bg-transparent",
                            "text-gray-800 dark:text-white",
                            "placeholder:text-gray-400 dark:placeholder:text-white/60",
                            "text-base",
                        ],
                        innerWrapper: "bg-transparent",
                        inputWrapper: [
                            "bg-white/40 dark:bg-gray-800/40",
                            "backdrop-blur-md",
                            "border border-gray-300 dark:border-gray-600",
                            "hover:border-gray-400 dark:hover:border-gray-500",
                            "focus-within:!border-indigo-500",
                            "transition-all",
                            "h-12",
                            "!cursor-not-allowed",
                        ],
                    }}
                />
                <div>
                    <label
                        htmlFor="completeDateCalendar"
                        className="block text-sm font-medium text-gray-700 dark:text-white mb-2"
                    >
                        Complete Date
                    </label>
                    <Calendar
                        id="completeDateCalendar"
                        aria-label="Complete Date Picker"
                        value={data.completeAt ? parseDate(data.completeAt) : undefined}
                        onChange={(dateValue) =>
                            onChange("completeAt", dateValue?.toString() ?? "")
                        }
                    />
                </div>
                {/* Left column: Level + Description */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">
                            Level
                        </label>
                        <LevelDropdown
                            selectedLevel={data.level || "Low"}
                            onChange={(val) => onChange("level", val)}
                        />
                    </div>

                    {/* Description */}
                    <Input
                        label="Description"
                        value={data.description}
                        onValueChange={(val) => onChange("description", val)}
                        placeholder="Enter Description"
                        type="text"
                        className="w-full"
                        classNames={{
                            label: "text-gray-700 dark:text-white font-medium",
                            input: [
                                "bg-transparent",
                                "text-gray-800 dark:text-white",
                                "placeholder:text-gray-400 dark:placeholder:text-white/60",
                                "text-base",
                            ],
                            innerWrapper: "bg-transparent",
                            inputWrapper: [
                                "bg-white/40 dark:bg-gray-800/40",
                                "backdrop-blur-md",
                                "border border-gray-300 dark:border-gray-600",
                                "hover:border-gray-400 dark:hover:border-gray-500",
                                "focus-within:!border-indigo-500",
                                "transition-all",
                                "min-h-[100px]",
                            ],
                        }}
                    />
                </div>

                {/* Right column: Complete Date */}

            </div>
        </div>
    );
};

export default NewTaskTypeForm;
