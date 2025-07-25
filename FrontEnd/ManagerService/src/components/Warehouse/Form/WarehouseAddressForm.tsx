import React, { useState, useEffect } from 'react';
import { Input, Select, SelectItem } from '@heroui/react';
import { MapPin, Home, Map } from 'lucide-react';

interface WarehouseAddressFormProps {
    data: {
        address: string;
        street: string;
        district: string;
        country: string;
    };
    onChange: (key: string, value: string) => void;
}

const WarehouseAddressForm: React.FC<WarehouseAddressFormProps> = ({ data, onChange }) => {
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [provinceCode, setProvinceCode] = useState<string>("");
    const [districtCode, setDistrictCode] = useState<string>("");
    const [wardCode, setWardCode] = useState<string>("");

    // Load provinces on mount - sử dụng pattern từ SupplierForm
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    // Load districts when province changes
    useEffect(() => {
        if (provinceCode) {
            fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
                .then((res) => res.json())
                .then((data) => setDistricts(data.districts));
        }
    }, [provinceCode]);

    // Load wards when district changes
    useEffect(() => {
        if (districtCode) {
            fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
                .then((res) => res.json())
                .then((data) => {
                    setWards(data.wards || []);
                });
        } else {
            setWards([]);
        }
    }, [districtCode]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Province */}
                <Select
                    label="Tỉnh/Thành phố"
                    placeholder="Chọn tỉnh/thành phố"
                    selectedKeys={[provinceCode]}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        const selected = provinces.find((prov: any) => prov.code.toString() === selectedKey);
                        setProvinceCode(selectedKey);
                        onChange("country", selected?.name || "");
                        // Reset district and ward when province changes
                        setDistrictCode("");
                        setWardCode("");
                        onChange("district", "");
                        onChange("street", "");
                    }}
                    startContent={<Map className="w-4 h-4 text-gray-400" />}
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                >
                    {provinces.map((prov: any) => (
                        <SelectItem key={prov.code} value={prov.code}>
                            {prov.name}
                        </SelectItem>
                    ))}
                </Select>

                {/* District */}
                <Select
                    label="Quận/Huyện"
                    placeholder="Chọn quận/huyện"
                    selectedKeys={[districtCode]}
                    isDisabled={!provinceCode}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        const selected = districts.find((dist: any) => dist.code.toString() === selectedKey);
                        setDistrictCode(selectedKey);
                        onChange("district", selected?.name || "");
                        // Reset ward when district changes
                        setWardCode("");
                        onChange("street", "");
                    }}
                    startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                >
                    {districts.map((dist: any) => (
                        <SelectItem key={dist.code} value={dist.code}>
                            {dist.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ward */}
                <Select
                    label="Phường/Xã"
                    placeholder="Chọn phường/xã"
                    selectedKeys={[wardCode]}
                    isDisabled={!districtCode}
                    onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        const selected = wards.find((ward: any) => ward.code.toString() === selectedKey);
                        setWardCode(selectedKey);
                        onChange("street", selected?.name || "");
                    }}
                    startContent={<Home className="w-4 h-4 text-gray-400" />}
                    classNames={{
                        trigger: "bg-white dark:bg-gray-800",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                >
                    {wards.map((ward: any) => (
                        <SelectItem key={ward.code} value={ward.code}>
                            {ward.name}
                        </SelectItem>
                    ))}
                </Select>

                {/* Detailed Address */}
                <Input
                    label="Địa chỉ cụ thể"
                    placeholder="Số nhà, tên đường..."
                    value={data.address}
                    onValueChange={(val) => onChange("address", val)}
                    startContent={<MapPin className="w-4 h-4 text-gray-400" />}
                    validate={(value) => {
                        if (value.length < 5) {
                            return "Địa chỉ cụ thể phải có ít nhất 5 ký tự";
                        }
                    }}
                    classNames={{
                        input: "text-gray-800 dark:text-white",
                        label: "text-gray-700 dark:text-gray-300"
                    }}
                    isRequired
                />
            </div>

            {/* Address Preview */}
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Địa chỉ đầy đủ:
                </h4>
                <p className="text-gray-900 dark:text-white">
                    {[data.address, data.street, data.district, data.country]
                        .filter(Boolean)
                        .join(", ") || "Chưa có thông tin địa chỉ"}
                </p>
            </div>
        </div>
    );
};

export default WarehouseAddressForm;