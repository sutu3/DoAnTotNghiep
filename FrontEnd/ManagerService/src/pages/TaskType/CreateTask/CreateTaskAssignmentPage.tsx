import  { useEffect, useState } from 'react';
import { Card, CardBody, Button } from '@heroui/react';
import { ArrowLeft, Save  } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TaskTypeSelector, UsersSelector } from '@/Store/Selector';
import { MiddleGetAllTaskType } from '@/Store/TaskTypeSlice';
import { MiddleGetAllUser } from '@/Store/Thunk/UserThunk';
import {  TaskCreated } from '@/pages/TaskType/Component/Store/TaskSlice.tsx';
import TaskAssignmentForm from "@/components/Admin/TaskType/Form/TaskAssignmentForm.tsx";
import TaskBasicInfoForm from "@/components/Admin/TaskType/Form/TaskBasicInfor.tsx";
import PageHeader from "@/components/Admin/TaskType/PageHeader.tsx";
import TaskPreviewCard from "@/components/Admin/TaskType/TaskPreviewCard.tsx";
import {MiddleGetWarehouseByUser} from "@/Store/Thunk/WarehouseThunk.tsx";
import {TaskUserAssignment} from "@/pages/TaskType/Component/Store/TaskUserSlice.tsx";
import {MiddleAddTaskUser} from "@/pages/TaskType/Component/Store/TaskUserThunk.tsx";

const CreateTaskAssignmentPage = () => {
    const [assignedUsers, setAssignedUsers] = useState<TaskUserAssignment[]>([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const taskTypes = useSelector(TaskTypeSelector);
    const users = useSelector(UsersSelector);

    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<TaskCreated>({
        requiresEvidence: false,
        taskType: '',
        level: 'Medium',
        description: '',
        completeAt: '',
        warehouses: ''
    });
    useEffect(() => {
        const fetch=async()=>{
           await (dispatch as any)(MiddleGetWarehouseByUser({ pageNumber: 0, pageSize: 50 }));
        }
        fetch();
    }, []);

    useEffect(() => {
        loadInitialData();
    }, [formData?.warehouses]);

    const loadInitialData = async () => {
        setLoading(true);
        if(formData?.warehouses!=""){
            try {
                await Promise.all([
                    (dispatch as any)(MiddleGetAllTaskType(formData?.warehouses,{ pageNumber: 0, pageSize: 50 })),
                    (dispatch as any)(MiddleGetAllUser(formData?.warehouses,{ pageNumber: 0, pageSize: 100 }))
                ]);
            } finally {
                setLoading(false);
            }
        }

    };

    const handleFormChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleUserAssignment = (userIds: string[]) => {
        setAssignedUsers(userIds);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Tạo task trước

             await (dispatch as any)(MiddleAddTaskUser(formData,assignedUsers));

            // Tạo TaskUserRequest cho từng user được assign
            // Gọi API để assign users với thông tin chi tiết

            navigate('/admin/task-assignments');
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.taskType &&
            formData.description &&
            formData.warehouses &&
            assignedUsers.length > 0;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <PageHeader
                    currentStep={currentStep}
                    onBack={() => navigate('/admin/task-assignments')}
                />

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left Column - Forms (2/3) */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Step 1: Basic Task Information */}
                        <TaskBasicInfoForm
                            formData={formData}
                            onChange={handleFormChange}
                            taskTypes={taskTypes}
                            currentStep={currentStep}
                            onStepChange={setCurrentStep}
                        />

                        {/* Step 2: User Assignment */}
                        {currentStep==2&& <TaskAssignmentForm
                            users={users}
                            assignedUsers={assignedUsers}
                            onUserAssignment={handleUserAssignment}
                            currentStep={currentStep}
                            onStepChange={setCurrentStep}
                            warehouseId={formData.warehouses}
                        />}


                        {/* Action Buttons */}
                        <Card className="shadow-lg">
                            <CardBody>
                                <div className="flex gap-4 justify-between">
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onClick={() => navigate('/admin/task-assignments')}
                                        startContent={<ArrowLeft className="w-4 h-4" />}
                                    >
                                        Hủy bỏ
                                    </Button>

                                    <div className="flex gap-3">
                                        {currentStep > 1 && (
                                            <Button
                                                variant="bordered"
                                                onClick={() => setCurrentStep(currentStep - 1)}
                                            >
                                                Quay lại
                                            </Button>
                                        )}

                                        {currentStep < 2 ? (
                                            <Button
                                                color="primary"
                                                onClick={() => setCurrentStep(currentStep + 1)}
                                                isDisabled={!formData.taskType || !formData.description}
                                            >
                                                Tiếp theo
                                            </Button>
                                        ) : (
                                            <Button
                                                color="success"
                                                onClick={handleSubmit}
                                                isLoading={loading}
                                                isDisabled={!isFormValid()}
                                                startContent={<Save className="w-4 h-4" />}
                                            >
                                                {loading ? 'Đang tạo...' : 'Tạo nhiệm vụ'}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right Column - Preview & Summary (1/3) */}
                    <div className="xl:col-span-1">
                        <TaskPreviewCard
                            formData={formData}
                            assignedUsers={assignedUsers}
                            users={users}
                            taskTypes={taskTypes}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskAssignmentPage;