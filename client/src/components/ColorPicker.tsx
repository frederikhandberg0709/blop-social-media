import React, { useState, useEffect } from "react";

const predefinedColors = [
  "#3b82f6", // blue
  "#10b981", // green
  "#ef4444", // red
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#ec4899", // pink
];

interface ColorPickerProps {
  initialColor: string;
  onColorChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  initialColor,
  onColorChange,
}) => {
  const [selectedColor, setSelectedColor] = useState(initialColor);

  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
    onColorChange(color);
  };

  const handlePredefinedColorClick = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {predefinedColors.map((color) => (
          <button
            key={color}
            onClick={() => handlePredefinedColorClick(color)}
            style={{ backgroundColor: color }}
            className="w-8 h-8 rounded-full"
          ></button>
        ))}
      </div>
      <input
        type="color"
        value={selectedColor}
        onChange={handleColorChange}
        className="w-full"
      />
    </div>
  );
};

export default ColorPicker;
