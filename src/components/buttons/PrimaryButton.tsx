import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import useUserColor from "@/hooks/useUserColor";
import { darkenColor } from "@/utils/darkenColor";

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function PrimaryButton({
  children,
  onClick,
  ...props
}: PrimaryButtonProps) {
  const userColor = useUserColor();
  const hoverColor = darkenColor(userColor, -25);

  return (
    <button
      onClick={onClick}
      className={twMerge(
        "font-semibold text-base text-white px-4 py-2 rounded-xl transition-all duration-150 ease-in-out"
      )}
      style={
        {
          backgroundColor: userColor,
        } as React.CSSProperties
      }
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = userColor)}
      {...props}
    >
      {children}
    </button>
  );
}
