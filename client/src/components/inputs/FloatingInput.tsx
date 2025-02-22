import React from "react";
import { twMerge } from "tailwind-merge";
import "./floatinginput.css";

interface FloatingInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  className?: string;
  id?: string;
  placeholder: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "border";
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    { className, id, placeholder, size = "md", variant = "default", ...props },
    ref,
  ) => {
    const baseStyles =
      "w-full rounded-xl outline-none transition duration-200 ease-in-out";

    const sizeStyles = {
      sm: "h-12 px-3 py-1.5 text-sm",
      md: "h-14 px-4 py-2 text-base",
      lg: "h-16 px-5 py-3 text-base",
    };

    const variantStyles = {
      default:
        "w-[400px] bg-black/10 outline-none hover:bg-black/20 focus:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:focus:bg-white/20",
      border: "border-2 border-blue-500",
    };

    // Floating label
    const heightMap = {
      sm: 48,
      md: 56,
      lg: 64,
    };

    const fontSizeMap = {
      sm: 14,
      md: 16,
      lg: 18,
    };

    const labelPadding = {
      sm: "px-3",
      md: "px-4",
      lg: "px-5",
    };

    const getLabelTopPosition = (size: "sm" | "md" | "lg") => {
      const inputHeight = heightMap[size];
      const fontSize = fontSizeMap[size];
      const labelHeight = fontSize * 1.2;
      return `${(inputHeight - labelHeight) / 2 - 2}px`;
    };

    return (
      <div className="floating-input relative w-full">
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          id={id}
          className={twMerge(
            baseStyles,
            sizeStyles[size],
            variantStyles[variant],
            className,
          )}
          {...props}
        />
        <label
          htmlFor={id}
          style={{ top: getLabelTopPosition(size) }}
          className={twMerge(
            "pointer-events-none absolute left-0 origin-left transform text-gray-400 transition-all duration-150 ease-in-out",
            labelPadding[size],
          )}
        >
          {placeholder}
        </label>
      </div>
    );
  },
);

FloatingInput.displayName = "FloatingInput";

export default FloatingInput;
