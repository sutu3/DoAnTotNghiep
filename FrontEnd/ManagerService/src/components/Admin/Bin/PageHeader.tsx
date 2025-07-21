import React from "react";
import {Button, Breadcrumbs, BreadcrumbItem} from "@heroui/react";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
    loading?: boolean;
    stackName: string;
    isEditing: boolean;
    onToggleEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
                                                            loading,
                                                          stackName,
                                                          isEditing,
                                                          onToggleEdit,
                                                          onSave,
                                                          onCancel
                                                      }) => {
    const navigate = useNavigate();

    return (
        <div className="mb-6">
            <Breadcrumbs className="mb-4">
                <BreadcrumbItem onClick={() => navigate("/admin/locations")}>
                    Stacks
                </BreadcrumbItem>
                <BreadcrumbItem>{stackName || "Stack Detail"}</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onClick={() => navigate("/admin/locations")}
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            {stackName || "Stack Detail"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage stack configuration and view bin contents
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button
                                color="danger"
                                variant="light"
                                startContent={<X className="w-4 h-4" />}
                                onClick={onCancel}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                isLoading={loading}
                                startContent={<Save className="w-4 h-4" />}
                                onClick={onSave}
                            >
                                Save Changes
                            </Button>
                        </>
                    ) : (
                        <Button
                            color="primary"
                            variant="light"
                            startContent={<Edit className="w-4 h-4" />}
                            onClick={onToggleEdit}
                        >
                            Edit Stack
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};