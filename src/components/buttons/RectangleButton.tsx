import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface RectangleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function RectangleButton({
  children,
  ...props
}: RectangleButtonProps) {
  return (
    <button
      className={twMerge(
        "bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
