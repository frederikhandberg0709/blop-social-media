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
    <label className="flex cursor-pointer items-center gap-[10px]">
      <div
        className={`relative inline-block h-[30px] w-[55px] select-none align-middle transition duration-200 ease-in-out ${checked ? "bg-blue-500" : "bg-white/10"} rounded-full`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white shadow-md shadow-black/15 transition-all duration-200 ease-in hover:shadow-xl hover:shadow-black/65"
          style={{ top: "3px", left: checked ? "27px" : "4px" }}
        />
      </div>
      <span className="text-md select-none">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
