"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeDropdown() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full max-w-xs">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="cursor-pointer rounded-md px-3 py-2"
      >
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}
