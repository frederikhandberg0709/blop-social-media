"use client";

import { ButtonHTMLAttributes, ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import useUserColor from "@/hooks/useUserColor";
import { darkenColor } from "@/utils/darkenColor";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function PrimaryButton({
  children,
  onClick,
  className,
  disabled,
  ...props
}: PrimaryButtonProps) {
  const userColor = useUserColor();
  const hoverColor = darkenColor(userColor, -25);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        "rounded-xl px-4 py-2 text-base font-semibold text-white transition-all duration-150 ease-in-out",
        disabled ? "cursor-not-allowed opacity-50" : "",
        className,
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
