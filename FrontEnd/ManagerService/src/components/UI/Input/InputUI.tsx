import { Input } from "@heroui/react";

interface InputProg {
  onChange: (value: string) => void;
  defaultValue: string;
  label: string;
  placeholder: string;
  type: string;
}
const InputUI = ({
  onChange,
  defaultValue,
  label,
  placeholder,
  type,
}: InputProg) => {
  return (
    <Input
      isClearable
      aria-labelledby="Input"
      className="max-w-xs"
      defaultValue={defaultValue}
      label={label}
      placeholder={placeholder}
      type={type}
      variant="bordered"
      onChange={(e) => onChange(e.target.value)}
      // eslint-disable-next-line no-console
      onClear={() => console.log("input cleared")}
    />
  );
};

export default InputUI;
