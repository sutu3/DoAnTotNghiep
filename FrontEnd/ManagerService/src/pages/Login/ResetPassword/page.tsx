import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Button } from '@heroui/react';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {MiddleResetPassword} from "@/pages/Login/Component/Store/Thunk/AuthThunk.tsx";
import {getUserRoleFromToken} from "@/Utils/auth.ts";

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user');

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            // Show error toast
            return;
        }

        if (formData.newPassword.length < 6) {
            // Show error toast
            return;
        }

        setLoading(true);
        try {
            await (dispatch as any)(MiddleResetPassword({
                userId: userId!,
                newPassword: formData.newPassword
            }));
            setSuccess(true);
            const role =await getUserRoleFromToken();
            role == "manager" ? window.location.href = "/admin" : window.location.href = "/staff/tasks";
        } catch (error) {
            console.error('Error resetting password:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.newPassword.length >= 6 &&
            formData.newPassword === formData.confirmPassword;
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
                <Card className="shadow-2xl border-0 max-w-md w-full">
                    <CardBody className="p-8 text-center">
                        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            Đặt lại mật khẩu thành công!
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Mật khẩu của bạn đã được cập nhật. Bạn sẽ được chuyển đến trang đăng nhập.
                        </p>
                        <div className="text-sm text-gray-500">
                            Chuyển hướng trong 3 giây...
                        </div>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0">
                    <CardBody className="p-8">
                        <div className="text-center mb-8">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-blue-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                                Đặt lại mật khẩu
                            </h1>
                            <p className="text-gray-600">
                                Nhập mật khẩu mới cho tài khoản của bạn
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                type={showPassword ? "text" : "password"}
                                label="Mật khẩu mới"
                                placeholder="Nhập mật khẩu mới"
                                value={formData.newPassword}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, newPassword: value }))}
                                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                                isRequired
                                variant="bordered"
                            />

                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                label="Xác nhận mật khẩu"
                                placeholder="Nhập lại mật khẩu mới"
                                value={formData.confirmPassword}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, confirmPassword: value }))}
                                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                                endContent={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                }
                                isRequired
                                variant="bordered"
                                color={formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? "danger" : "default"}
                                errorMessage={formData.confirmPassword && formData.newPassword !== formData.confirmPassword ? "Mật khẩu không khớp" : ""}
                            />

                            <div className="text-xs text-gray-500">
                                Mật khẩu phải có ít nhất 6 ký tự
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                startContent={<Lock className="w-4 h-4" />}
                                isLoading={loading}
                                isDisabled={!isFormValid()}
                            >
                                {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                            </Button>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
export default ResetPasswordPage;