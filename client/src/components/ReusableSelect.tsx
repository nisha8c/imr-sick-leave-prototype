import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "./ui/select.tsx";

interface SelectOption {
    value: string;
    label: string;
}

interface ReusableSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    className?: string;
    triggerClassName?: string;
}

export const ReusableSelect = ({
                                   value,
                                   onValueChange,
                                   options,
                                   placeholder,
                                   className,
                                   triggerClassName = 'w-full md:w-[160px]',
                               }: ReusableSelectProps) => {
    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={triggerClassName}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className={`z-[9999] bg-background text-foreground border border-border shadow-xl rounded-md ${className || ''}`}>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
