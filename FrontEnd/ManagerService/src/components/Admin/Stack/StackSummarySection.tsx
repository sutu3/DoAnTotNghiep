import StackSummaryPanel from "@/components/Admin/StackSummaryPanel.tsx";
import {StackType} from "@/Store/StackSlice.tsx";
import {Button} from "@heroui/button";
import {BarChart3, Edit, Eye} from "lucide-react";
import {useNavigate} from "react-router-dom";

interface StackSummarySectionProps {
    selectedStack: StackType | null;
}

export const StackSummarySection = ({ selectedStack }: StackSummarySectionProps) => {
    const navigate = useNavigate();
    return (
        <div className="space-y-6">
            {/* Enhanced Summary Panel */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <StackSummaryPanel stack={selectedStack} />
            </div>

            {/* Quick Actions Card */}
            {selectedStack && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            startContent={<Eye className="w-4 h-4" />}
                            onClick={() => {
                                navigate(`/admin/locations/stack?stackId=${selectedStack.stackId}`);
                            }}
                        >
                            View Details
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            startContent={<Edit className="w-4 h-4" />}
                        >
                            Edit Stack
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            startContent={<BarChart3 className="w-4 h-4" />}
                        >
                            View Analytics
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};