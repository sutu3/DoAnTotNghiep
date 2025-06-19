import { Input } from "@heroui/react";
import {SearchIcon} from "lucide-react";

interface InputProg {
    onChange: (value: string) => void;
    defaultValue: string;
    label: string;
    placeholder: string;
    type: string;
}

const InputTaskType = ({
                     onChange,
                     defaultValue,
                     label,
                     placeholder,
                     type,
                 }: InputProg) => {
    return (
        <Input
            startContent={<SearchIcon className="text-default-300"/>}
            label={label}
            value={defaultValue} // dùng controlled component
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            type={type}
            classNames={{
                label: "text-base font-medium text-black/70 dark:text-white/80",
                base: "w-full max-w-md h-[40px]",
                input: [
                    "w-[400px]",
                    "bg-transparent",
                    "text-black dark:text-white",
                    "placeholder:text-gray-500 dark:placeholder:text-gray-400",
                    "text-base",
                ],

                innerWrapper: "bg-transparent",

                inputWrapper: [
                    "h-14", // fixed height
                    "px-4", // padding horizontal
                    "bg-white/60 dark:bg-white/10",
                    "hover:bg-white/80 dark:hover:bg-white/20",
                    "group-data-[focus=true]:bg-white/90 dark:group-data-[focus=true]:bg-white/20",
                    "border border-gray-300 dark:border-gray-600",
                    "rounded-xl",
                    "backdrop-blur-md",
                    "transition-all duration-200 ease-in-out",
                    "shadow-md hover:shadow-lg",
                    "!cursor-text",
                ],
            }}
        />
    );
};

export default InputTaskType;
