import clsx from "clsx";

interface ButtonProps {
  title: string;
  size?: 'sm' | 'md' | 'lg';
}
export default function Button({ title, size = 'md' }: ButtonProps) {
  return (
    <button
      className={clsx(
        "relative inline-block group cursor-pointer",
        size === "sm" && "text-lg",
        size === "md" && "text-xl",
        size === "lg" && "text-2xl"
      )}
    >
      <span
        className={clsx(
          "relative z-10 block overflow-hidden font-medium leading-tight text-gray-800 transition-colors duration-300 ease-out border-2 border-gray-900 rounded-lg group-hover:text-white",
          size === "sm" && "px-4 py-1",
          size === "md" && "px-5 py-3",
          size === "lg" && "px-5 py-3"
        )}
      >
        <span
          className={clsx(
            "absolute inset-0 w-full h-full rounded-lg bg-gray-50",
            size === "sm" && "px-4 py-1",
            size === "md" && "px-5 py-3",
            size === "lg" && "px-5 py-3"
          )}
        ></span>
        <span
          className={clsx(
            "absolute left-0 w-48 h-48 -ml-2 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-gray-900 group-hover:-rotate-180 ease"
          )}
        ></span>
        <span className="relative">{title}</span>
      </span>
      <span
        className={clsx(
          "absolute bottom-0 right-0 w-full transition-all duration-200 ease-linear bg-gray-900 rounded-lg group-hover:mb-0 group-hover:mr-0",
          size === "sm" && "h-8 -mb-1 -mr-1",
          size === "md" && "h-12 -mb-1 -mr-1",
          size === "lg" && "h-12 -mb-1 -mr-1",
        )}
        data-rounded="rounded-lg"
      ></span>
    </button>
  );
}
