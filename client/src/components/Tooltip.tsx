"use client";

import React, { FC, useState, useEffect, CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  offset?: string;
  className?: string;
  responsive?: {
    sm?: "top" | "bottom" | "left" | "right";
    smOffset?: string;
    md?: "top" | "bottom" | "left" | "right";
    mdOffset?: string;
    lg?: "top" | "bottom" | "left" | "right";
    lgOffset?: string;
  };
}

export const Tooltip: FC<TooltipProps> = ({
  text,
  children,
  position = "top",
  offset = "45",
  className,
  responsive,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (hovering) {
      timeoutId = setTimeout(() => setIsVisible(true), 650);
    } else {
      setIsVisible(false);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [hovering]);

  const handleMouseEnter = () => {
    setHovering(true);
  };

  const handleMouseLeave = () => {
    setHovering(false);
  };

  const tooltipOpacity = isVisible ? "opacity-95" : "opacity-0";

  const getTooltipPositionStyle = (
    pos: string,
    offset: string,
  ): CSSProperties => {
    switch (pos) {
      case "top":
        return {
          bottom: `${offset}px`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "bottom":
        return {
          top: `${offset}px`,
          left: "50%",
          transform: "translateX(-50%)",
        };
      case "left":
        return {
          top: "50%",
          left: `-${offset}px`,
          transform: "translateY(-50%)",
        };
      case "right":
        return {
          top: "50%",
          right: `-${offset}px`,
          transform: "translateY(-50%)",
        };
      default:
        return {
          top: `${offset}px`,
          left: "50%",
          transform: "translateX(-50%)",
        };
    }
  };

  const tooltipPositionStyle = getTooltipPositionStyle(position, offset);

  return (
    <div
      className={twMerge("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        style={tooltipPositionStyle}
        className={`pointer-events-none absolute z-50 select-none rounded-md bg-[#1f1f1f] bg-opacity-95 px-[10px] py-[5px] text-center text-[15px] text-white/75 transition-opacity duration-300 ease-in-out ${tooltipOpacity}`}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {text}
        </span>
      </div>
    </div>
  );
};
