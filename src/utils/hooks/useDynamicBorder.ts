import { useColor } from "@/context/ColorContext";
import { useCallback } from "react";

const useDynamicBorder = () => {
  const { borderColor } = useColor();

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = borderColor;
    },
    [borderColor]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = `${borderColor}33`; // 20% opacity
    },
    [borderColor]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = borderColor;
    },
    [borderColor]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.currentTarget.style.borderColor = `${borderColor}33`; // 20% opacity
    },
    [borderColor]
  );

  const getDynamicBorderStyle = useCallback(
    (borderWidth: string) => ({
      borderColor: `${borderColor}33`, // 20% opacity by default
      borderWidth,
    }),
    [borderColor]
  );

  return {
    handleFocus,
    handleBlur,
    handleMouseEnter,
    handleMouseLeave,
    getDynamicBorderStyle,
  };
};

export default useDynamicBorder;
