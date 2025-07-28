import StackSummaryPanel from "@/components/Admin/StackSummaryPanel.tsx";
import {StackType} from "@/Store/StackSlice.tsx";

interface StackSummarySectionProps {
    selectedStack: StackType | null;
}

export const StackSummarySection = ({ selectedStack }: StackSummarySectionProps) => {
    // @ts-ignore
    return (
        <div className="space-y-6">
            {/* Enhanced Summary Panel */}
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <StackSummaryPanel stack={selectedStack} />
            </div>

            {/* Quick Actions Card */}

        </div>
    );
};