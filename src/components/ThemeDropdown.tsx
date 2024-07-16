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

  // const { theme, setTheme } = useTheme();

  // useEffect(() => {
  //   const savedTheme = localStorage.getItem("theme") || "dark";
  //   setTheme(savedTheme);
  // }, [setTheme]);

  // const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newTheme = event.target.value;
  //   setTheme(newTheme);
  //   localStorage.setItem("theme", newTheme);
  // };

  return (
    <div className="w-full max-w-xs">
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="system">System</option>
        <option value="dark">Dark</option>
        <option value="light">Light</option>
      </select>
    </div>
  );
}
