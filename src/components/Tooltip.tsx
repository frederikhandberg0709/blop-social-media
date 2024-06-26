"use client";

import React, { FC, useState, useEffect, CSSProperties } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  offset?: string;
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
    offset: string
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
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div
        style={tooltipPositionStyle}
        className={`absolute z-50 px-[10px] py-[5px] text-center select-none pointer-events-none bg-[#1f1f1f] bg-opacity-95 text-white/75 text-[15px] rounded-md transition-opacity ease-in-out duration-300 ${tooltipOpacity}`}
      >
        <span className="whitespace-nowrap overflow-hidden text-ellipsis">
          {text}
        </span>
      </div>
    </div>
  );
};
