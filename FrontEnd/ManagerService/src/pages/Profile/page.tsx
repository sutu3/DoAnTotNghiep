import  {useEffect, useState } from 'react';
import {Card, CardBody, Button} from '@heroui/react';
import {  Save, ArrowLeft } from 'lucide-react';
import {  useNavigate } from 'react-router-dom';
import UserProfileHeader from "@/components/Admin/Profile/UserProfileHeader.tsx";
import UserBasicInfoForm from "@/components/Admin/Profile/Form/UserBasicInfoForm.tsx";
import UserContactForm from '@/components/Admin/Profile/Form/UserContactForm';
import UserActivitySummary from "@/components/Admin/Profile/UserActivitySummary.tsx";
import UserWarehouseInfo from "@/components/Admin/Profile/UserWarehouseInfo.tsx";
import {UserData, UserUpdate} from "@/Store/UserSlice.tsx";
import {useDispatch, useSelector} from "react-redux";
import {UserSelector} from "@/Store/Selector.tsx";
import {MiddleGetInforUser, MiddleUpdateInforUser} from "@/Store/Thunk/UserThunk.tsx";
import {MiddleUploadImage, UploadResponse} from "@/Store/Thunk/UploadThunk.tsx";
import {useFileStore} from "@/zustand/File.tsx";

const UserProfilePage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const {file}=useFileStore();
    const user:UserData=useSelector(UserSelector)
    useEffect(() => {
        (dispatch as any)(MiddleGetInforUser());
    },[])
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserUpdate|null>(null);
    console.log(user)
    useEffect(() => {
        setFormData({
            dateOfBirth: user?.dateOfBirth || '',
            gender: user?.gender || '',
            homeAddress: user?.homeAddress || '',
            userName: user?.userName || '',
            fullName: user?.fullName || '',
            email: user?.email || '',
            phoneNumber: user?.phoneNumber || '',
            urlImage: user?.urlImage || '',
        })
    },[user])




    const handleFormChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        console.log("Save",formData)
        setLoading(true);
        let image=user?.urlImage;
        if(file){
            const imageResponse:UploadResponse=await (dispatch as any)(MiddleUploadImage());
            image= imageResponse?.urlImage || user?.urlImage;
        }
        const newValue:UserUpdate={...formData, urlImage: image};
        await (dispatch as any)(MiddleUpdateInforUser(user?.userId,newValue))
        setLoading(false);
        setIsEditing(false);
        // Reload user data after saving
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                dateOfBirth: user?.dateOfBirth || '',
                gender: user?.gender || '',
                homeAddress: user?.homeAddress || '',
                userName: user?.userName || '',
                fullName: user?.fullName || '',
                email: user?.email || '',
                phoneNumber: user?.phoneNumber || '',
                urlImage: user?.urlImage || '',
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