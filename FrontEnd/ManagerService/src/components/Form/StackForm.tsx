import { Input } from "@heroui/react";

import { StackCreate } from "@/Store/StackSlice.tsx";

interface Props {
  data: StackCreate;
  onChange: (key: string, value: string) => void;
}
const StackForm = ({ data, onChange }: Props) => {
  return (
    <div className="space-y-4">
      <Input
        label="Stack Name"
        value={data.stackName}
        onValueChange={(val) => onChange("stackName", val)}
      />
      <Input
        label="Description"
        value={data.description}
        onValueChange={(val) => onChange("description", val)}
      />
    </div>
  );
};

export default StackForm;
