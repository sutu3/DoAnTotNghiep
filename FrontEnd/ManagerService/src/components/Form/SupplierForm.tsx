"use client";
import {useEffect, useState} from "react";
import {Input, Select, SelectItem} from "@heroui/react";
import {useFileStore} from "@/zustand/File.tsx";
import useSupplierStore from "@/zustand/Supplier.tsx";

export default function SupplierForm() {
    const { supplier, setSupplier } = useSupplierStore();
    const {setFile} =useFileStore();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);

    // ✅ State to store codes (you wanted this)
    const [provinceCode, setProvinceCode] = useState<string>("");
    const [districtCode, setDistrictCode] = useState<string>("");

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [wards, setWards] = useState([]);
    const [wardCode, setWardCode] = useState<string>("");

// Fetch wards when district changes

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    useEffect(() => {
        if (provinceCode) {
            fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
                .then((res) => res.json())
                .then((data) => setDistricts(data.districts));
        }
    }, [provinceCode]);
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
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSupplier({urlSupplier: url});
        }
    };

    return (
        <div className="space-y-6 p-2 max-w-5xl mx-auto">
            {/* Image Upload */}
            <div className="flex items-center gap-2">
                <div className="w-full">
                    <Input
                        aria-labelledby="Input"
                        label="Upload Image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="w-24 h-24 border rounded overflow-hidden flex items-center justify-center">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full"
                        />
                    ) : (
                        <span className="text-xs text-gray-400">Preview</span>
                    )}
                </div>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    aria-labelledby="Input"
                    label="Supplier Name"
                    value={supplier.supplierName}
                    onChange={(e) => setSupplier({ supplierName: e.target.value })}
                />
                <Input
                    aria-labelledby="Input"
                    label="Email"
                    type="email"
                    value={supplier.email}
                    onChange={(e) => setSupplier({ email: e.target.value })}
                />
                <Input
                    aria-labelledby="Input"
                    label="Phone Number"
                    value={supplier.phoneNumber}
                    onChange={(e) => setSupplier({ phoneNumber: e.target.value })}
                />
                <Input
                    aria-labelledby="Input"
                    label="Address"
                    value={supplier.address}
                    onChange={(e) => setSupplier({ address: e.target.value })}
                />
            </div>



            {/* Province */}
            <Select
                aria-labelledby="Input"
                label="City / Province"
                selectedKeys={[provinceCode]}
                onChange={(key) => {
                    const selected = provinces.find((prov: any) => prov.code.toString() === key.target.value);
                    // @ts-ignore
                    setProvinceCode(selected?.code.toString() || "");
                    // @ts-ignore
                    setSupplier({ country:  selected?.name||"" });
                }}
            >
                {provinces.map((prov: any) => (
                    <SelectItem key={prov.code}>
                        {prov.name}
                    </SelectItem>
                ))}
            </Select>

            {/* District */}
            <Select
                aria-labelledby="Input"
                label="District"
                selectedKeys={[districtCode]}
                isDisabled={!provinceCode}
                onChange={(key) => {
                    const selected = districts.find((dist: any) => dist.code.toString() === key.target.value);
                    // @ts-ignore
                    setDistrictCode(selected?.code.toString() || "");
                    // @ts-ignore
                    setSupplier({ district: selected?.name || "" }); // ✅ Save name in store
                }}
            >
                {districts.map((dist: any) => (
                    <SelectItem aria-labelledby="Input"
                                key={dist.code} value={dist.code}>
                        {dist.name}
                    </SelectItem>
                ))}
            </Select>
            <Select
                aria-labelledby="Input"
                label="Ward / Commune"
                selectedKeys={[wardCode]}
                isDisabled={!districtCode}
                onChange={(key) => {
                    const selected = wards.find((ward: any) => ward.code.toString() === key.target.value);
                    // @ts-ignore
                    setWardCode(selected?.code.toString() || "");
                    // @ts-ignore
                    setSupplier({ street: selected?.name || "" }); // Save ward name to supplier.street
                }}
            >
                {wards.map((ward: any) => (
                    <SelectItem key={ward.code} value={ward.code}>
                        {ward.name}
                    </SelectItem>
                ))}
            </Select>

        </div>
    );
}
