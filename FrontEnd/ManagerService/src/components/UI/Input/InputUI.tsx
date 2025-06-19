import { Input } from "@heroui/react";

interface InputProg {
  onChange: (value: string) => void;
  defaultValue: string;
  label: string;
  placeholder: string;
  type: string;
  className?: string; // 👈 optional className
}

const InputUI = ({
                   onChange,
                   defaultValue,
                   label,
                   placeholder,
                   type,
                   className = "max-w-xs", // 👈 default fallback
                 }: InputProg) => {
  return (
      <Input
          isClearable
          aria-labelledby="Input"
          className={className} // 👈 apply class
          defaultValue={defaultValue}
          label={label}
          placeholder={placeholder}
          type={type}
          variant="bordered"
          onChange={(e) => onChange(e.target.value)}
          onClear={() => console.log("input cleared")}
      />
  );
};

export default InputUI;
