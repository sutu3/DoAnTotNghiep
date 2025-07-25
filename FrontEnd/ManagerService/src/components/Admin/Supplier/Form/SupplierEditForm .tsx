import React, { useState, useEffect } from 'react';
import { Input, Textarea, Button, Divider } from '@heroui/react';
import { Building2, MapPin, Phone, Mail, Save, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import {Supplier} from "@/Store/SupplierSlice.tsx";
// import { MiddleUpdateSupplier } from '@/Store/Thunk/ShupplierThunk';

interface SupplierEditFormProps {
    supplier: Supplier;
    onUpdate: (supplier: any) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

const SupplierEditForm: React.FC<SupplierEditFormProps> = ({
                                                               supplier,
                                                               onUpdate,
                                                               loading,
                                                               setLoading
                                                           }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        supplierName: '',
        email: '',
        phoneNumber: '',
        address: '',
        street: '',
        district: '',
        country: '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                supplierName: supplier.supplierName || '',
                email: supplier.email || '',
                phoneNumber: supplier.phoneNumber || '',
                address: supplier.address || '',
                street: supplier.street || '',
                district: supplier.district || '',
                country: supplier.country || '',
            });
        }
    }, [supplier]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // await (dispatch as any)(MiddleUpdateSupplier(supplier.supplierId, formData));
            onUpdate({ ...supplier, ...formData });
        } catch (error) {
            console.error('Error updating supplier:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thông tin cơ bản
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Tên nhà cung cấp"
                        placeholder="Nhập tên nhà cung cấp"
                        value={formData.supplierName}
                        onValueChange={(val) => handleChange('supplierName', val)}
                        startContent={<Building2 className="w-4 h-4 text-gray-400" />}
                        isRequired
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="supplier@example.com"
                        value={formData.email}
                        onValueChange={(val) => handleChange('email', val)}
                        startContent={<Mail className="w-4 h-4 text-gray-400" />}
                        isRequired
                    />
                </div>

                <Input
                    label="Số điện thoại"
                    placeholder="0123456789"
                    value={formData.phoneNumber}
                    onValueChange={(val) => handleChange('phoneNumber', val)}
                    startContent={<Phone className="w-4 h-4 text-gray-400" />}
                    isRequired
                />
            </div>

            <Divider />

            {/* Address Information */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Thông tin địa chỉ
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        label="Đường/Số nhà"
                        placeholder="123 Đường ABC"
                        value={formData.street}
                        onValueChange={(val) => handleChange('street', val)}
                    />

                    <Input
                        label="Quận/Huyện"
                        placeholder="Quận 1"
                        value={formData.district}
                        onValueChange={(val) => handleChange('district', val)}
                    />

                    <Input
                        label="Tỉnh/Thành phố"
                        placeholder="TP. Hồ Chí Minh"
                        value={formData.country}
                        onValueChange={(val) => handleChange('country', val)}
                    />
                </div>

                <Textarea
                    label="Địa chỉ đầy đủ"
                    placeholder="Nhập địa chỉ đầy đủ của nhà cung cấp"
                    value={formData.address}
                    onValueChange={(val) => handleChange('address', val)}
                    startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                />
            </div>

            <Divider />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end">
                <Button
                    color="danger"
                    variant="light"
                    startContent={<X className="w-4 h-4" />}
                    type="button"
                >
                    Hủy bỏ
                </Button>

                <Button
                    color="primary"
                    type="submit"
                    isLoading={loading}
                    startContent={<Save className="w-4 h-4" />}
                >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </div>
        </form>
    );
};

export default SupplierEditForm;