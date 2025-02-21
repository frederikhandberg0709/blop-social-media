import React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "primary_glow"
    | "secondary"
    | "danger"
    | "warning"
    | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "full";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      rounded = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700",
      primary_glow:
        "relative bottom-0 font-semibold text-blue-500 transition-all duration-150 ease-in-out hover:bottom-1 hover:bg-blue-600 hover:text-white hover:shadow-[0_5px_40px_10px_rgb(37,99,235,0.5)]",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
      danger:
        "text-white bg-red-600 hover:bg-red-700 active:bg-red-800 dark:bg-red-500 dark:hover:bg-red-600 dark:active:bg-red-700",
      warning:
        "text-white bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const roundedStyles = {
      none: "rounded-none",
      sm: "rounded",
      md: "rounded-xl",
      full: "rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "font-medium transition-all duration-200 ease-in-out active:scale-95 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          roundedStyles[rounded],
          className,
        )}
        {...props}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {!isLoading && leftIcon}
          {children}
          {!isLoading && rightIcon}
        </span>
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
