import { useState } from "react";
import FloatingInput from "@/components/inputs/FloatingInput";
import { Tooltip } from "@/components/Tooltip";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function PasswordInput({
  value,
  onChange,
  name,
  placeholder,
  disabled = false,
  required = false,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <FloatingInput
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={className}
      />
      <div className="absolute inset-y-1.5 right-1.5">
        <Tooltip
          text={showPassword ? "Hide Password" : "Show Password"}
          offset={"50"}
          className="h-full"
        >
          <button
            type="button"
            onClick={handlePasswordVisibility}
            className="hover:black/5 group flex aspect-square h-full items-center justify-center rounded-[6px] transition duration-200 ease-in-out active:bg-white/10 dark:hover:bg-white/5 dark:active:bg-white/10"
          >
            {showPassword ? (
              <Eye
                size={20}
                className="opacity-50 transition duration-200 ease-in-out group-hover:opacity-100"
              />
            ) : (
              <EyeOff
                size={20}
                className="opacity-50 transition duration-200 ease-in-out group-hover:opacity-100"
              />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
