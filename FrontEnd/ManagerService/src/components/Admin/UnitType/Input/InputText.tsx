interface FormInputProps {
    label: string;
    value: string | number;
    onChange?: (value: string) => void;
    type?: string;
    readOnly?: boolean;
}

const FormInput = ({ label, value, onChange, type = "text", readOnly = false }: FormInputProps) => {
    return (
        <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
            <input
                aria-labelledby="Input"
                type={type}
                value={value}
                onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                readOnly={readOnly}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
        </div>
    );
};
export default FormInput;