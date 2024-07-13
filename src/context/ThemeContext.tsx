"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const ThemeContext = createContext({
  borderColor: "#3b82f6",
  setBorderColor: (color: string) => {},
});

export const ThemeProvider = ({ children }) => {
  const { data: session } = useSession();
  const [borderColor, setBorderColor] = useState("#3b82f6"); // Default color

  // Fetch user color from API or database here
  useEffect(() => {
    const fetchUserColor = async (userId: string) => {
      const response = await fetch(`/api/user-color?userId=${userId}`);
      const data = await response.json();
      setBorderColor(data.color || "#3b82f6");
    };

    if (session?.user.id) {
      fetchUserColor(session.user.id);
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--border-color", borderColor);
  }, [borderColor]);

  return (
    <ThemeContext.Provider value={{ borderColor, setBorderColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
