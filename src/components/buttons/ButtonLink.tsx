import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ButtonLinkProps {
  href: string;
  variant?:
    | "primary"
    | "primary_outline"
    | "secondary"
    | "danger"
    | "warning"
    | "ghost";
  size?: "sm" | "md" | "lg";
  rounded?: "none" | "sm" | "md" | "full";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  external?: boolean;
  disabled?: boolean;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      className,
      variant = "primary",
      size = "md",
      rounded = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      external = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary:
        "text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700",
      primary_outline:
        "border-[3px] border-blue-600 hover:border-blue-700 hover:bg-blue-700 active:border-blue-800 active:bg-blue-800 dark:text-blue-500 dark:hover:text-white dark:border-blue-500 dark:hover:border-blue-600 dark:hover:bg-blue-600 dark:active:border-blue-700 dark:active:bg-blue-700",
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

    const linkClasses = cn(
      "inline-flex font-medium transition-all duration-200 ease-in-out active:scale-95",
      variants[variant],
      sizes[size],
      roundedStyles[rounded],
      disabled && "opacity-50 pointer-events-none cursor-not-allowed",
      className,
    );

    const content = (
      <span className="flex items-center justify-center gap-2">
        {isLoading && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </span>
    );

    if (external) {
      return (
        <a
          ref={ref}
          href={disabled ? undefined : href}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        ref={ref}
        href={disabled ? "#" : href}
        className={linkClasses}
        aria-disabled={disabled}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
        {...props}
      >
        {content}
      </Link>
    );
  },
);

ButtonLink.displayName = "ButtonLink";

export default ButtonLink;
