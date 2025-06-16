import { Input } from "@heroui/react";
import {UserCreate} from "@/pages/User/page.tsx";


interface Props {
    data: UserCreate;
    onChange: (key:string,value: string) => void;
}
const UserForm = ({data,onChange}:Props) => {




  return (
    <div className="space-y-4">
      <Input
        label="User Name"
        value={data.userName}
        onValueChange={(val) => onChange("userName", val)}
      />
      <Input
        label="Full Name"
        value={data.fullName}
        onValueChange={(val) => onChange("fullName", val)}
      />
      <Input
        type="email"
        label="Email"
        value={data.email}
        onValueChange={(val) => onChange("email", val)}
      />
      <Input
        label="Phone Number"
        value={data.phoneNumber}
        onValueChange={(val) => onChange("phoneNumber", val)}
      />

    </div>
  );
};

export default UserForm;
