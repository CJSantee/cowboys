import { Switch as HeadlessSwitch } from '@headlessui/react';

export default function Switch({
  checked,
  onChange,
}: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}) {
  return (
    <HeadlessSwitch
      checked={checked}
      onChange={onChange}
      className="group inline-flex h-6 w-11 items-center rounded-full bg-white transition data-checked:bg-green-400 border-2 border-black">
      <span className="size-4 translate-x-1 rounded-full bg-black transition group-data-checked:translate-x-6" />
    </HeadlessSwitch>
  );
}
