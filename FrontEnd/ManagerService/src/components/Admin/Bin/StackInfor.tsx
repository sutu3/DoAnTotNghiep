import React from "react";
import { Card, CardBody, CardHeader, Input } from "@heroui/react";
import { Layers, MapPin, Calendar } from "lucide-react";
import { StackType } from "@/Store/StackSlice.tsx";

interface StackInfoProps {
    stack: StackType;
    onStackChange: (key: string, value: string) => void;
    isEditable?: boolean;
}

export const StackInfo: React.FC<StackInfoProps> = ({
                                                        stack,
                                                        onStackChange,
                                                        isEditable = false
                                                    }) => {
    return (
        <Card className="p-6">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Stack Information
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Storage location details
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardBody className="space-y-4">
                <Input
                    label="Stack Name"
                    value={stack?.stackName || ""}
                    onChange={(e) => onStackChange("stackName", e.target.value)}
                    isReadOnly={!isEditable}
                    startContent={<Layers className="w-4 h-4 text-gray-400" />}
                    validate={(value) => {
                        if (!value || value.length < 2) {
                            return "Stack name must be at least 2 characters";
                        }
                        if (value.length > 50) {
                            return "Stack name must not exceed 50 characters";
                        }
                    }}
                    isRequired
                />

                <Input
                    label="Description"
                    value={stack?.description || ""}
                    onChange={(e) => onStackChange("description", e.target.value)}
                    isReadOnly={!isEditable}
                    isRequired
                    validate={(value) => {
                        if (!value || value.length < 5) {
                            return "Description must be at least 5 characters";
                        }
                        if (value.length > 200) {
                            return "Description must not exceed 200 characters";
                        }
                    }}
                />

                {stack?.warehouse && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium">Warehouse</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {stack.warehouse.warehouseName}
                            </p>
                        </div>
                    </div>
                )}

                {stack?.createdAt && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                            <p className="text-sm font-medium">Created</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(stack.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    </div>
                )}

                {/* Bin Statistics */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                    <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-emerald-600">
                            {stack?.bin?.filter(b => b.status === "EMPTY").length || 0}
                        </p>
                        <p className="text-xs text-emerald-600">Empty</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">
                            {stack?.bin?.filter(b => b.status === "FULL").length || 0}
                        </p>
                        <p className="text-xs text-blue-600">In Use</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">
                            {stack?.bin?.filter(b => b.status === "MAINTENANCE").length || 0}
                        </p>
                        <p className="text-xs text-amber-600">Maintenance</p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};