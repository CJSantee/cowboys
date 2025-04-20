import {
  Input as HeadlessInput,
  InputProps as HeadlessInputProps,
} from "@headlessui/react";

interface InputProps extends Omit<HeadlessInputProps, "onChange"> {
  label?: string;
  onChange: (value: string) => void;
};
export default function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled = false,
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="pl-1">{label}</label>
      )}
      <HeadlessInput
        as="input"
        id={label}
        type={type}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 rounded-2xl py-3 px-4 border-2 border-gray-900"
      />
    </div>
  );
}