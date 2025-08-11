import React, { useState } from 'react';
import { Card, CardBody, Input, Button, Link } from '@heroui/react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {MiddleForgotPassword} from "@/pages/Login/Component/Store/Thunk/AuthThunk.tsx";

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        try {
            await (dispatch as any)(MiddleForgotPassword(email));
            setSent(true);
        } catch (error) {
            console.error('Error sending reset email:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl border-0">
                    <CardBody className="p-8">
                        <div className="text-center mb-8">
                            <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                Quên mật khẩu?
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {sent ?
                                    'Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn' :
                                    'Nhập email để nhận link đặt lại mật khẩu'
                                }
                            </p>
                        </div>

                        {!sent ? (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    type="email"
                                    label="Email"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    value={email}
                                    onValueChange={setEmail}
                                    startContent={<Mail className="w-4 h-4 text-gray-400" />}
                                    isRequired
                                    variant="bordered"
                                />

                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                                    startContent={<Send className="w-4 h-4" />}
                                    isLoading={loading}
                                    isDisabled={!email.trim()}
                                >
                                    {loading ? 'Đang gửi...' : 'Gửi link đặt lại'}
                                </Button>
                            </form>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <p className="text-green-800 dark:text-green-200 text-sm">
                                        Email đã được gửi đến <strong>{email}</strong>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Kiểm tra hộp thư spam nếu không thấy email
                                </p>
                            </div>
                        )}

                        <div className="mt-8 text-center">
                            <Link
                                as="button"
                                onClick={() => navigate('/login')}
                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center justify-center gap-1"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;