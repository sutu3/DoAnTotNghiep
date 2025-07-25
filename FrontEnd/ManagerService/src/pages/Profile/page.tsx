import  { useEffect, useState } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import {  Save, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { UserSelector } from '@/Store/Selector';
import { MiddleGetAllUser } from '@/Store/Thunk/UserThunk';
import UserProfileHeader from "@/components/Admin/Profile/UserProfileHeader.tsx";
import UserBasicInfoForm from "@/components/Admin/Profile/Form/UserBasicInfoForm.tsx";
import UserContactForm from '@/components/Admin/Profile/Form/UserContactForm';
import UserActivitySummary from "@/components/Admin/Profile/UserActivitySummary.tsx";
import UserWarehouseInfo from "@/components/Admin/Profile/UserWarehouseInfo.tsx";

const UserProfilePage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const users = useSelector(UserSelector);

    const [user, setUser] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        userName: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        urlImage: '',
        warehouses: ''
    });

    useEffect(() => {
        if (userId) {
            loadUserData();
        }
    }, [userId]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            await (dispatch as any)(MiddleGetAllUser({ pageNumber: 0, pageSize: 100 }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (users && userId) {
            const currentUser = users.find((u: any) => u.userId === userId);
            if (currentUser) {
                setUser(currentUser);
                setFormData({
                    userName: currentUser.userName || '',
                    fullName: currentUser.fullName || '',
                    email: currentUser.email || '',
                    phoneNumber: currentUser.phoneNumber || '',
                    urlImage: currentUser.urlImage || '',
                    warehouses: currentUser.warehouses?.warehouseId || ''
                });
            }
        }
    }, [users, userId]);

    const handleFormChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            // await (dispatch as any)(MiddleUpdateUser(userId!, formData));
            setIsEditing(false);
            await loadUserData();
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                userName: user.userName || '',
                fullName: user.fullName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                urlImage: user.urlImage || '',
                warehouses: user.warehouses?.warehouseId || ''
            });
        }
        setIsEditing(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thông tin người dùng...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <UserProfileHeader
                    user={user}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onBack={() => navigate('/admin/users')}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Forms (2/3) */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <UserBasicInfoForm
                            formData={formData}
                            isEditing={isEditing}
                            onChange={handleFormChange}
                        />

                        {/* Contact Information */}
                        <UserContactForm
                            formData={formData}
                            isEditing={isEditing}
                            onChange={handleFormChange}
                        />

                        {/* Action Buttons */}
                        {isEditing && (
                            <Card className="shadow-lg">
                                <CardBody>
                                    <div className="flex gap-4 justify-end">
                                        <Button
                                            color="danger"
                                            variant="light"
                                            onClick={handleCancel}
                                            startContent={<ArrowLeft className="w-4 h-4" />}
                                        >
                                            Hủy bỏ
                                        </Button>
                                        <Button
                                            color="success"
                                            onClick={handleSave}
                                            isLoading={loading}
                                            startContent={<Save className="w-4 h-4" />}
                                        >
                                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Info & Activity (1/3) */}
                    <div className="xl:col-span-1 space-y-6">
                        <UserWarehouseInfo user={user} />
                        <UserActivitySummary user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;