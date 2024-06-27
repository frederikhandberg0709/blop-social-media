import React, { ReactNode } from "react";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
}) => {
  return (
    <label className="flex gap-[10px] items-center cursor-pointer">
      <div
        className={`relative inline-block w-[55px] h-[30px] align-middle select-none transition duration-200 ease-in-out
            ${checked ? "bg-blue-500" : "bg-white/10"}
            rounded-full`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ease-in"
          style={{ top: "3px", left: checked ? "27px" : "4px" }}
        />
      </div>
      <span className="select-none">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
