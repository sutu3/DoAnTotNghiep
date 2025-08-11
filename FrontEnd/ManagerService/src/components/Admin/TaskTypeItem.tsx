import React from 'react';
import { BadgeCheck, Warehouse } from "lucide-react";
import clsx from "clsx";
import {getRandomLightColor} from "@/Utils/RandumColor.tsx";
import {TaskType} from "@/pages/TaskType/Component/Store/TaskSlice.tsx";

// Renamed from TaskType to TaskTypeCard for clarity

interface TaskTypeCardProps {
    taskType: TaskType; // TaskType data comes as a prop
    onClick?: (task: TaskType) => void; // Optional click handler if needed for navigation/details
}
const TaskTypeCard: React.FC<TaskTypeCardProps> = ({ taskType, onClick }) => {
    const { taskTypeId, taskName, description, warehouses, createdAt } = taskType;
    const color=getRandomLightColor();
    console.log(color)
    const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <div
            className={clsx(
                "p-3  rounded-xl border shadow-sm hover:shadow-lg hover:border-blue-300  transition border-2 rounded-md",
                "w-full", // Full width within its grid cell
                "bg-white dark:bg-gray-800 ", // Subtle gradient background
                "flex flex-col h-full overflow-hidden ",
                onClick && "cursor-pointer" // Add cursor pointer if onClick is provided
            )}
            onClick={onClick ? () => onClick(taskType) : undefined} // Attach click handler
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3 ">
                <div>
                    <div  className={`font-serif bg-gradient-to-br from-[#A78BFA] to-blue-300 rounded-md p-3 -translate-x-5 -translate-y-5 text-[14px] font-bold text-gray-700 leading-tight `}>
                        {taskName.length>20?taskName.substring(0, 17)+"...":taskName}
                    </div>
                    {/* Added margin-top for spacing below the title */}
                    <p className="text-sm text-gray-800 dark:text-gray-100 mt-1">
                        {description}
                    </p>
                </div>
                {/* Status Badge (Hardcoded "Active" - you'd make this dynamic) */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 font-medium shadow-inner flex-shrink-0"> {/* flex-shrink-0 prevents badge from squishing */}
                    <BadgeCheck size={14} />
                    Active
                </span>
            </div>

            {/* Warehouse Info */}
            {warehouses && (
                // Used a different background/border color for the warehouse info block
                <div className="mt-auto mb-4 bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-indigo-700 font-medium">
                        <Warehouse size={16} />
                        <span>Warehouse: <span className="font-semibold">{warehouses.warehouseName}</span></span>
                    </div>
                    {/* Added padding left for alignment with icon, and slightly lighter color */}
                    <p className="text-xs text-indigo-600 mt-1 pl-6">
                        Manager ID: <span className="font-semibold">{warehouses.managerId}</span>
                    </p>
                </div>
            )}
            {!warehouses && (
                // Placeholder if no warehouse is assigned, keeps layout consistent
                <div className="mt-auto mb-4 bg-gray-50 border border-gray-100 rounded-lg p-3 text-gray-500 text-sm">
                    No assigned warehouse
                </div>
            )}


            {/* Footer */}
            {/* Increased border and added text color */}
            <div className="mt-2 flex justify-between items-center text-xs text-gray-600 border-t border-gray-200 pt-3">
                {/* Changed clock emoji to lucid icon and improved styling */}
                <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg> {/* Basic clock icon SVG if not using lucide directly here */}
                    <span className="italic">{formattedDate}</span>
                </div>

                <span className="text-gray-400 font-mono text-right">ID: {taskTypeId.slice(0, 8)}...</span> {/* Using font-mono for ID */}
            </div>
        </div>
    );
};

export default TaskTypeCard;