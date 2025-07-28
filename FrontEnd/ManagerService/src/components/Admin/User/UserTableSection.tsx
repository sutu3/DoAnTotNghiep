import React from "react";
import { Users, Plus } from "lucide-react";
import { Button } from "@heroui/button";
import UserTable from "@/components/Admin/User/TableUI.tsx";
import SelectWarehouse from "@/components/Admin/User/SelectWarehouse.tsx";
import {UserCreate} from "@/Store/UserSlice.tsx";

interface UserTableSectionProps {
    loading:boolean
    formData:UserCreate,
    onFormChange: (key: string, value: string) => void;
    selectedUser: any | null;
    onUserClick: (userId: string) => void;
    onOpenModal: (open: boolean) => void;
    isModalOpen: boolean;
    users: any[];
    totalPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

export const UserTableSection: React.FC<UserTableSectionProps> = ({loading,formData,onFormChange,
                                                                      selectedUser,
                                                                      onUserClick,
                                                                      onOpenModal,
                                                                      users,
                                                                      totalPage,
                                                                      currentPage,
                                                                      onPageChange
                                                                  }) => {
    return (
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                Warehouse Staff
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Click on a user to view details
                            </p>
                        </div>
                    </div>
                    <SelectWarehouse formData={formData} onFormChange={onFormChange}/>
                    <Button
                        onClick={() => onOpenModal(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                        startContent={<Plus className="w-4 h-4" />}
                    >
                        Add New User
                    </Button>
                </div>
            </div>

            <div className="p-6">
                <UserTable
                    loading={loading}
                    users={users}
                    onUserSelect={onUserClick}
                    selectedUserId={selectedUser?.userId}
                    totalPage={totalPage}
                    currentPage={currentPage}
                    onPageChange={onPageChange}  />
            </div>
        </div>
    );
};