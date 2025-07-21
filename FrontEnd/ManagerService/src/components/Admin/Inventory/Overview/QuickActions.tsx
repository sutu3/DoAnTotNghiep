import { Button } from "@heroui/react";
import { Plus, FileText, Search, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            label: "Add Stock Movement",
            icon: <Plus className="w-4 h-4" />,
            color: "primary" as const,
            onClick: () => navigate("/admin/inventory/movements/create")
        },
        {
            label: "Generate Report",
            icon: <FileText className="w-4 h-4" />,
            color: "secondary" as const,
            onClick: () => navigate("/admin/inventory/reports")
        },
        {
            label: "Search Inventory",
            icon: <Search className="w-4 h-4" />,
            color: "default" as const,
            onClick: () => navigate("/admin/inventory/search")
        },
        {
            label: "Settings",
            icon: <Settings className="w-4 h-4" />,
            color: "default" as const,
            onClick: () => navigate("/admin/inventory/settings")
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        color={action.color}
                        variant="flat"
                        startContent={action.icon}
                        onClick={action.onClick}
                        className="justify-start h-12"
                    >
                        {action.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;