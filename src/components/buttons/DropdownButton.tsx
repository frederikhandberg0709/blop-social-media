import { ChevronDown } from "lucide-react";
import Button from "./Button";
import React, { useEffect, useRef, useState } from "react";

interface DropdownButtonProps {
  children: React.ReactNode;
  options: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
  variant?: "primary" | "secondary" | "danger" | "warning" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  buttonText?: string;
  align?: "left" | "right";
  width?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({
  children,
  options,
  variant = "ghost",
  size = "sm",
  className = "",
  align = "left",
  width = "w-48",
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant={variant}
        size={size}
        rightIcon={
          <ChevronDown
            className={`${isOpen ? "rotate-180" : "rotate-0"} stroke-white/50 transition duration-200 ease-in-out group-hover:stroke-white`}
          />
        }
        onClick={toggleDropdown}
        className={`group !text-white/50 hover:!text-white ${className}`}
        {...props}
      >
        {children}
      </Button>

      {isOpen && (
        <div
          className={`absolute z-10 mt-2 ${width} rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  option.onClick();
                  setIsOpen(false);
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                role="menuitem"
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
