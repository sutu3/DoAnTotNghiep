import { Input } from "@heroui/react";
import { UserCreate } from "@/Store/UserSlice.tsx";

interface Props {
    data: UserCreate;
    onChange: (key: string, value: string) => void;
}

const UserForm = ({ data, onChange }: Props) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Username"
                    validate={(value) => {
                        if (!value) return "Username là bắt buộc";
                        if (value.length < 2 || value.length > 50)
                            return "Username phải từ 2 đến 50 ký tự";
                        if (!/^[a-zA-Z0-9_]+$/.test(value))
                            return "Username chỉ được chứa chữ cái, số và dấu gạch dưới";
                    }}
                    placeholder="Nhập username"
                    value={data.userName}
                    onValueChange={(val) => onChange("userName", val)}
                />

                <Input
                    label="Full Name"
                    validate={(value) => {
                        if (!value) return "Họ tên là bắt buộc";
                        if (value.length < 2 || value.length > 100)
                            return "Họ tên phải từ 2 đến 100 ký tự";
                    }}
                    placeholder="Nhập họ tên đầy đủ"
                    value={data.fullName}
                    onValueChange={(val) => onChange("fullName", val)}
                />

                <Input
                    label="Email"
                    type="email"
                    validate={(value) => {
                        if (!value) return "Email là bắt buộc";
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                            return "Email không hợp lệ";
                        if (value.length > 255)
                            return "Email không được quá 255 ký tự";
                    }}
                    placeholder="john.doe@gmail.com"
                    value={data.email}
                    onValueChange={(val) => onChange("email", val)}
                />

                <Input
                    label="Phone Number"
                    validate={(value) => {
                        if (!value) return "Số điện thoại là bắt buộc";
                        if (value.length < 9 || value.length > 20)
                            return "Số điện thoại phải từ 9 đến 20 ký tự";
                    }}
                    placeholder="0987654321"
                    value={data.phoneNumber}
                    onValueChange={(val) => onChange("phoneNumber", val)}
                />
            </div>
        </div>
    );
};

export default UserForm;
