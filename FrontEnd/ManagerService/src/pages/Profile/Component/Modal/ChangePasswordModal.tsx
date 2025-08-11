import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input
} from '@heroui/react';
import { Lock, Eye, EyeOff, Key } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { fetchApi } from '@/Api/FetchApi';
import { API_ROUTES } from '@/Api/UrlApi';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

interface PasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
                                                                     isOpen,
                                                                     onOpenChange,
                                                                     userId
                                                                 }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Partial<PasswordFormData>>({});

    const [formData, setFormData] = useState<PasswordFormData>({
        newPassword: '',
        confirmPassword: ''
    });

    const handleInputChange = (field: keyof PasswordFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<PasswordFormData> = {};



        if (!formData.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }



        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChangePassword = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetchApi({
                method: 'PUT',
                url: API_ROUTES.Authen.Authen().changePassword,
                body: {
                    newPassword: formData.newPassword
                },
                headers: undefined
            });

            if (response.success) {
                // Reset form
                setFormData({
                    newPassword: '',
                    confirmPassword: ''
                });
                onOpenChange(false);
                // Show success message (you can use toast here)
                console.log('Đổi mật khẩu thành công');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            size="md"
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
                                <Key className="w-5 h-5 text-blue-600" />
                                <span className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Thay Đổi Mật Khẩu
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-normal">
                                Nhập mật khẩu hiện tại và mật khẩu mới để thay đổi
                            </p>
                        </ModalHeader>

                        <ModalBody className="space-y-4">


                            {/* New Password */}
                            <Input
                                label="Mật khẩu mới"
                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                type={showNewPassword ? "text" : "password"}
                                value={formData.newPassword}
                                onValueChange={(value) => handleInputChange('newPassword', value)}
                                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                }
                                isInvalid={!!errors.newPassword}
                                errorMessage={errors.newPassword}
                                variant="bordered"
                            />

                            {/* Confirm Password */}
                            <Input
                                label="Xác nhận mật khẩu mới"
                                placeholder="Nhập lại mật khẩu mới"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onValueChange={(value) => handleInputChange('confirmPassword', value)}
                                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="focus:outline-none"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <Eye className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                }
                                isInvalid={!!errors.confirmPassword}
                                errorMessage={errors.confirmPassword}
                                variant="bordered"
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={handleClose}
                            >
                                Hủy
                            </Button>
                            <Button
                                color="primary"
                                onPress={handleChangePassword}
                                isLoading={loading}
                                startContent={!loading && <Key className="w-4 h-4" />}
                            >
                                {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ChangePasswordModal;