import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DangerButtonProps {
  children: ReactNode;
}

export default function DangerButton({
  children,
  ...props
}: DangerButtonProps) {
  return (
    <button
      className={twMerge(
        "font-semibold text-base text-white bg-red-600 hover:bg-red-800 px-4 py-2 rounded-xl transition-all duration-150 ease-in-out"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
