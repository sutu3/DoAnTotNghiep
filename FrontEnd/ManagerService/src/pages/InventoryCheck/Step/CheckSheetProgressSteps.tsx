import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface CheckSheetProgressStepsProps {
    currentStep: number;
}

const CheckSheetProgressSteps: React.FC<CheckSheetProgressStepsProps> = ({ currentStep }) => {
    const steps = [
        { step: 1, title: "Thông Tin Cơ Bản", icon: "mdi:file-document-edit" },
        { step: 2, title: "Chọn Sản Phẩm", icon: "mdi:package-variant" },
        { step: 3, title: "Xác Nhận & Tạo", icon: "mdi:check-circle" }
    ];

    const getStepStatus = (step: number) => {
        if (step < currentStep) return "complete";
        if (step === currentStep) return "active";
        return "inactive";
    };

    return (
        <Card className="shadow-sm border-0 bg-white/70 backdrop-blur-sm">
            <CardBody className="p-6">
                <div className="flex items-center justify-between">
                    {steps.map((item, index) => (
                        <div key={item.step} className="flex items-center">
                            <div className={`flex items-center gap-3 ${
                                getStepStatus(item.step) === "complete" ? "text-green-500" :
                                    getStepStatus(item.step) === "active" ? "text-blue-500" :
                                        "text-gray-400"
                            }`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    getStepStatus(item.step) === "complete" ? "bg-green-50" :
                                        getStepStatus(item.step) === "active" ? "bg-blue-50" :
                                            "bg-gray-100"
                                }`}>
                                    <Icon icon={item.icon} className="text-lg" />
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{item.title}</p>
                                    <p className="text-xs opacity-70">Bước {item.step}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 h-0.5 mx-4 ${
                                    getStepStatus(item.step + 1) !== "inactive" ? "bg-blue-100" : "bg-gray-100"
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </CardBody>
        </Card>
    );
};

export default CheckSheetProgressSteps;