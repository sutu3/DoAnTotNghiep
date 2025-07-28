import React, {useState} from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { IdCard } from "lucide-react";
import UserForm from "@/components/Form/UserForm.tsx";
import {UserCreate} from "@/Store/UserSlice.tsx";
import {useDispatch} from "react-redux";
import {MiddleAddUser} from "@/Store/Thunk/UserThunk.tsx";
import {showToast} from "@/components/UI/Toast/ToastUI.tsx";

interface UserModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    formData: UserCreate;
    onFormChange: (key: string, value: string) => void;
}

const UserModal: React.FC<UserModalProps> = ({
                                                 isOpen,
                                                 onOpenChange,
                                                 formData,
                                                 onFormChange
                                             }) => {
    const [loading,setLoading] = useState(false);
    const dispatch = useDispatch();
    const handleAddUser= ()=>{
        const fetch=async ()=>{
            setLoading(true);
            await (dispatch as any)(MiddleAddUser(formData));
            showToast({
                title: "Thành công",
                description: "Người dùng đã được thêm thành công!",
                color: "success",
            });
            onFormChange("email", "");
            onFormChange("userName", "");
            onFormChange("fullName", "");
            onFormChange("phoneNumber", "");
            setLoading(false);
        }
        fetch();
        onOpenChange(false)
    }
    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="2xl"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white dark:bg-gray-800",
                header: "border-b border-gray-200 dark:border-gray-700",
                body: "py-6",
                footer: "border-t border-gray-200 dark:border-gray-700"
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <IdCard className="w-5 h-5 text-green-600" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                  Thêm nhân viên mới
                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                                Điền thông tin để thêm nhân viên vào hệ thống kho
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <UserForm data={formData} onChange={onFormChange} />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                isLoading={loading}
                                disabled={formData.userName.length<2&&!formData.email.includes("@")}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                                startContent={<IdCard className="w-4 h-4" />}
                                onPress={handleAddUser}
                            >
                                Thêm nhân viên
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UserModal;