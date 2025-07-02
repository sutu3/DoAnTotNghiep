import {Input, Textarea} from "@heroui/input";
import {CategoryCreate} from "@/Store/CategorySlice.tsx";

interface Props {
    data: CategoryCreate;
    onChange: (key: string, value: string | number) => void;
}
const CategoryForm = ({data, onChange}: Props) => {
    const handleInputChange = (key: string, value: string | number) => {
        console.log(value)
        onChange(key, value);
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <Input
                        aria-labelledby="Input"
                        label="Category Name"
                        validate={(value) => {
                            if (value.length < 2) {
                                return "Please category name";
                            }
                        }}
                        placeholder="Enter category name here"
                        value={data.categoryName}
                        onValueChange={(val) => onChange("categoryName", val)}
                    />
                </div>
                <div className="sm:col-span-2">
                    <Textarea
                        aria-labelledby="Input"
                        label="Description"
                        placeholder="Desciption here"
                        value={data.description}
                        onValueChange={(val) => handleInputChange("description", val)}
                    />
                </div>


            </div>
        </div>
    );
};

export default CategoryForm;
