import React, { useState, useRef } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Card,
    CardBody,
    Image
} from '@heroui/react';
import { Icon } from '@iconify/react';
import {useFileStore} from "@/zustand/File.tsx";

interface CompleteTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    taskUser: any;
    onConfirm: (image: File | null) => void;
}

const CompleteTaskModal: React.FC<CompleteTaskModalProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 taskUser,
                                                                 onConfirm
                                                             }) => {
    const {setFile}=useFileStore();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const isImage = file.type.startsWith('image/');
            const isPdf = file.type === 'application/pdf';

            if (!isImage && !isPdf) {
                alert('Chỉ hỗ trợ file ảnh hoặc PDF');
                return;
            }

            // if (file.size > 9 * 1024 * 1024) {
            //     alert('Kích thước file không được vượt quá 9MB');
            //     return;
            // }
            setFile(file);

            setSelectedImage(file);

            if (isImage) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            } else {
                setImagePreview(null);
            }
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            onConfirm(selectedImage);
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!taskUser) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            size="2xl"
            isDismissable={!loading}
        >
            <ModalContent>
                <ModalHeader className="flex items-center gap-3">
                    <div className="bg-green-100 rounded-lg p-2">
                        <Icon icon="mdi:check-circle" className="text-green-600 text-xl" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-green-700">Hoàn Thành Nhiệm Vụ</h3>
                        <p className="text-sm text-gray-600">Upload ảnh hoặc PDF xác nhận</p>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        {/* Task Info */}
                        <Card className="bg-green-50 border border-green-200">
                            <CardBody className="p-4">
                                <div className="flex items-center gap-3">
                                    <Icon icon="mdi:clipboard-check" className="text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-800">
                                            {taskUser.task.taskType.taskName}
                                        </p>
                                        <p className="text-sm text-green-600">
                                            {taskUser.task.description}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* File Upload */}
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-3">
                                Upload Ảnh hoặc PDF (Tùy chọn)
                            </h4>

                            {!selectedImage ? (
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-400 transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Icon icon="mdi:cloud-upload" className="text-4xl text-gray-400 mb-3" />
                                    <p className="text-gray-600 mb-2">
                                        Nhấn để chọn ảnh hoặc PDF, hoặc kéo thả file vào đây
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Hỗ trợ: JPG, PNG, GIF, PDF (Tối đa 5MB)
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full max-h-64 object-cover rounded-lg"
                                            />
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="solid"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onPress={handleRemoveImage}
                                            >
                                                <Icon icon="mdi:close" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-md">
                                            <Icon icon="mdi:file-pdf-box" className="text-red-600 text-3xl" />
                                            <div className="text-sm text-gray-700">
                                                <p>{selectedImage.name}</p>
                                                <p className="text-xs">
                                                    ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            </div>
                                            <Button
                                                isIconOnly
                                                color="danger"
                                                variant="solid"
                                                size="sm"
                                                className="ml-auto"
                                                onPress={handleRemoveImage}
                                            >
                                                <Icon icon="mdi:close" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                        </div>

                        {/* Success Message */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Icon icon="mdi:information" className="text-blue-600 text-xl mt-0.5" />
                                <div>
                                    <p className="font-medium text-blue-800">Thông tin:</p>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Sau khi hoàn thành, nhiệm vụ sẽ được đánh dấu là "Hoàn thành" và không thể chỉnh sửa.
                                        File đính kèm sẽ được lưu làm bằng chứng hoàn thành nhiệm vụ.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="light"
                        onPress={handleClose}
                        isDisabled={loading}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        color="success"
                        onPress={handleConfirm}
                        isLoading={loading}
                        startContent={!loading && <Icon icon="mdi:check-circle" />}
                    >
                        Hoàn thành nhiệm vụ
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CompleteTaskModal;