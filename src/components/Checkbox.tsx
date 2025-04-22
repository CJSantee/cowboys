import { Checkbox as HeadlessCheckbox, CheckboxProps as HeadlessCheckboxProps } from "@headlessui/react";

interface CheckboxProps extends HeadlessCheckboxProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
}
export default function Checkbox({ checked, setChecked, ...props }: CheckboxProps) {
  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={setChecked}
      className={
        "group block size-5 rounded border-2 border-gray-900 bg-white data-[checked]:bg-blue-500"
      }
      {...props}
    >
      <svg
        className="stroke-white opacity-0 group-data-[checked]:opacity-100"
        viewBox="0 0 14 14"
        fill="none"
      >
        <path
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </HeadlessCheckbox>
  );
}