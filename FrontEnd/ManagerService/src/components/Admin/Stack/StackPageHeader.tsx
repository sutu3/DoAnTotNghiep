import BreadcrumbsUI from "@/components/UI/Breadcrumbs/BreadcrumbsUI.tsx";
import {Layers} from "lucide-react";

interface StackPageHeaderProps {
    isDarkMode: boolean;
}

export const StackPageHeader = ({ isDarkMode }: StackPageHeaderProps) => {
    return (
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <BreadcrumbsUI isDarkMode={isDarkMode} />

            <div className="text-center sm:text-right">
                <div className="flex items-center gap-3 justify-center sm:justify-end">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Stack Management
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage warehouse storage locations and monitor capacity
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};