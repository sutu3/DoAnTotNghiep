import React from "react";

type StatCardProps = {
    mainValue: string | number;
    subLabel: string;
    rightValue?: string | number;
};

const StatCardAdmin: React.FC<StatCardProps> = ({ mainValue, subLabel, rightValue }) => {
    return (
        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-6 py-6 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-between w-full">
            <div>
                <div className="text-3xl font-bold">{mainValue}</div>
                <div className="text-md text-gray-500 dark:text-gray-400">{subLabel}</div>
            </div>
            {rightValue !== undefined && (
                <div className="border-l border-gray-200 dark:border-gray-700 pl-4 text-right ml-4">
                    <div className="text-xl font-semibold">{rightValue}</div>
                </div>
            )}
        </div>
    );
};

export default StatCardAdmin;