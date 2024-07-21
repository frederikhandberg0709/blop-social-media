import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface DangerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function DangerButton({
  children,
  onClick,
  ...props
}: DangerButtonProps) {
  return (
    <button
      className={twMerge(
        "rounded-xl bg-red-600 px-4 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out hover:bg-red-800",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
