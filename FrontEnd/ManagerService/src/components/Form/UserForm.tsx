import { Input } from "@heroui/react";
import {UserCreate} from "@/Store/UserSlice.tsx";

interface Props {
    data: UserCreate;
    onChange: (key: string, value: string) => void;
}

const UserForm = ({ data, onChange }: Props) => {
    return (
        <div className="space-y-6">
            {/* Header */}


            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="First Name"
                    validate={(value) => {
                    if (value.length <2) {
                        return "Please enter first name";
                    }
                }}
                    placeholder="Type your first name here"
                    value={data.userName}
                    onValueChange={(val) => onChange("userName", val)}
                />
                <Input
                    label="Last Name"
                    validate={(value) => {
                        if (value.length <6) {
                            return "Please enter full name";
                        }
                    }}
                    placeholder="Type your last name here"
                    value={data.fullName}
                    onValueChange={(val) => onChange("fullName", val)}
                />

                <Input
                    label="Email"
                    type="email"
                    errorMessage="Please enter a valid email"
                    placeholder="john.doe@gmail.com"
                    value={data.email}
                    onValueChange={(val) => onChange("email", val)}
                />
                <Input
                    label="Phone Number"
                    validate={(value) => {
                        if (value.length < 9) {
                            return "Phone Number must be at least 10 characters long";
                        }
                    }}
                    type="text"
                    placeholder="1234567890"
                    value={data.phoneNumber}
                    onValueChange={(val) => onChange("phoneNumber", val)} // optional if added
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="********"
                    value=""
                    onValueChange={() => {}}
                />
                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="********"
                    value=""
                    onValueChange={() => {}}
                />
            </div>
        </div>
    );
};

export default UserForm;
