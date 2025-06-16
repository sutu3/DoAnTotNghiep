import {Input} from "@heroui/react";

interface InputProg{
    onChange:(value:string) => void;
    defaultValue:string;
    label:string;
    placeholder:string;
    type:string;

}
const InputUI=({onChange,defaultValue,label,placeholder,type}:InputProg)=> {
    return (
        <Input

            aria-labelledby="Input"
            isClearable
            className="max-w-xs"
            defaultValue={defaultValue}
            label={label}
            selectionBehavior={"Replace"}
            placeholder={placeholder}
            type={type}
            variant="bordered"
            onChange={onChange}
            // eslint-disable-next-line no-console
            onClear={() => console.log("input cleared")}
        />
    );
}
export default InputUI;
