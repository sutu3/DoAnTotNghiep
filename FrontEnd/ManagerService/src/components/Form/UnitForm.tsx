import {UnitCreate} from "@/Store/Unit.tsx";
import {Input} from "@heroui/input";
import {Checkbox, CheckboxGroup, NumberInput} from "@heroui/react";
import {useSelector} from "react-redux";
import {GroupUnitSelector} from "@/Store/Selector.tsx";
import {GroupUnit} from "@/Store/GroupUnit.tsx";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

interface Props {
    data: UnitCreate;
    onChange: (key: string, value: string | number) => void;
}

const UnitForm = ({data, onChange}: Props) => {
    const handleInputChange = (key: string, value: string | number) => {
        console.log(value)
        onChange(key, value);
    };
    const groupUnit = useSelector(GroupUnitSelector);
    const options = groupUnit.map((el: GroupUnit) => ({
        key: el.groupUnitID,
        label: el.groupName,
    }));
    console.log(options)
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    aria-labelledby="Input"
                    label="Unit Name"
                    validate={(value) => {
                        if (value.length < 2) {
                            return "Please enter unit name";
                        }
                    }}
                    placeholder="Type unit name here"
                    value={data.unitName}
                    onValueChange={(val) => onChange("unitName", val)}
                />
                <Input
                    aria-labelledby="Input"
                    label="Short Name"
                    validate={(value) => {
                        if (value.length < 1) {
                            return "Please short name";
                        }
                    }}
                    placeholder="Type short name here"
                    value={data.shortName}
                    onValueChange={(val) => handleInputChange("shortName", val)}
                />
                <NumberInput
                    aria-labelledby="Input"
                    value={data.RatioToBase}
                    onValueChange={(val) => handleInputChange("RatioToBase", val)}
                    className="max-w-xs" placeholder="Enter the amount"
                />
                <CheckboxGroup
                    value={[data.groupUnit]} // Nếu chỉ chọn 1 group
                    onValueChange={(val) => handleInputChange("groupUnit", val[1])}
                    className="flex flex-col gap-2"
                >
                    {options.map((option: { key: Key | null | undefined; label: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                        <Checkbox key={option.key} value={option.key}>
                            {option.label}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            </div>
        </div>
    );
};

export default UnitForm;
