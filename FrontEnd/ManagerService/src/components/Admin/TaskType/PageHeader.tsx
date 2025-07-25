import React from 'react';
import { Card, CardBody, Button, Progress } from '@heroui/react';
import { ArrowLeft, Package, Users } from 'lucide-react';

interface PageHeaderProps {
    currentStep: number;
    onBack: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ currentStep, onBack }) => {
    const steps = [
        { id: 1, name: 'Thông tin nhiệm vụ', icon: Package },
        { id: 2, name: 'Phân công nhân viên', icon: Users }
    ];

    return (
        <div className="mb-8">
            <Button
                variant="light"
                startContent={<ArrowLeft className="w-4 h-4" />}
                onClick={onBack}
                className="mb-6"
            >
                Quay lại danh sách
            </Button>

            <Card className="shadow-lg">
                <CardBody className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
                                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    Tạo và phân công nhiệm vụ
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Tạo nhiệm vụ mới và phân công cho nhân viên kho
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;

                                return (
                                    <div key={step.id} className="flex items-center">
                                        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                                            isActive ? 'bg-blue-100 dark:bg-blue-900/30' :
                                                isCompleted ? 'bg-green-100 dark:bg-green-900/30' :
                                                    'bg-gray-100 dark:bg-gray-700'
                                        }`}>
                                            <div className={`p-2 rounded-full ${
                                                isActive ? 'bg-blue-600' :
                                                    isCompleted ? 'bg-green-600' :
                                                        'bg-gray-400'
                                            }`}>
                                                <Icon className="w-4 h-4 text-white" />
                                            </div>
                                            <span className={`font-medium ${
                                                isActive ? 'text-blue-700 dark:text-blue-300' :
                                                    isCompleted ? 'text-green-700 dark:text-green-300' :
                                                        'text-gray-600 dark:text-gray-400'
                                            }`}>
                                                {step.name}
                                            </span>
                                        </div>

                                        {index < steps.length - 1 && (
                                            <div className={`w-16 h-1 mx-4 rounded ${
                                                isCompleted ? 'bg-green-600' : 'bg-gray-300'
                                            }`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <Progress
                            value={(currentStep / steps.length) * 100}
                            color="primary"
                            className="h-2"
                        />
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default PageHeader;