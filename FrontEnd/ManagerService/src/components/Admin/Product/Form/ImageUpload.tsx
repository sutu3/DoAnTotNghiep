import React, { useState } from 'react';
import { Input, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import {useFileStore} from "@/zustand/File.tsx";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
    const [previewUrl, setPreviewUrl] = useState<string>(value);
    const {setFile}=useFileStore()
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            onChange(url);
        }
    };

    return (
        <div className="space-y-4">
            <Input
                type="file"
                accept="image/*"
                label="Hình ảnh sản phẩm"
                onChange={handleImageChange}
                startContent={<Icon icon="mdi:image" />}
            />

            {previewUrl && (
                <Card>
                    <CardBody className="p-4">
                        <div className="flex justify-center">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-w-full h-48 object-cover rounded-lg"
                            />
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default ImageUpload;