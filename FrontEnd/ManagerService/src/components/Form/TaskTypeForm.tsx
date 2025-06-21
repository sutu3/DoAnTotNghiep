import React from "react";
import { Input } from "@heroui/input";
import {TaskTypeCreated} from "@/Store/TaskTypeSlice.tsx";

interface Props {
    data: TaskTypeCreated;
    onChange: (key: string, value: string) => void;
}

const NewTaskTypeForm: React.FC<Props> = ({ data, onChange }) => {
    return (
        <form className="space-y-6 w-full">
            <Input
                label="Task Name"
                value={data.taskName}
                onValueChange={(val) => onChange("taskName", val)}
                placeholder="Enter task name"
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
                    ],
                }}
            />

            <Input
                label="Description"
                value={data.description}
                onValueChange={(val) => onChange("description", val)}
                placeholder="Enter description"
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
                    ],
                }}
            />
        </form>
    );
};

export default NewTaskTypeForm;
