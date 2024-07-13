"use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { useSession } from "next-auth/react";

// const ThemeContext = createContext({
//   borderColor: "#3b82f6",
//   setBorderColor: (color: string) => {},
// });

// export const ThemeProvider = ({ children }) => {
//   const { data: session } = useSession();
//   const [borderColor, setBorderColor] = useState("#3b82f6"); // Default color

//   useEffect(() => {
//     const fetchUserColor = async (userId: string) => {
//       const response = await fetch(`/api/user-color?userId=${userId}`);
//       const data = await response.json();
//       setBorderColor(data.color || "#3b82f6");
//     };

//     if (session?.user.id) {
//       fetchUserColor(session.user.id);
//     }
//   }, []);

//   useEffect(() => {
//     document.documentElement.style.setProperty("--border-color", borderColor);
//   }, [borderColor]);

//   return (
//     <ThemeContext.Provider value={{ borderColor, setBorderColor }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ThemeContextType {
  borderColor: string;
  setBorderColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session } = useSession();
  const [borderColor, setBorderColor] = useState<string>("#3b82f6");

  useEffect(() => {
    if (session) {
      const fetchUserColor = async (userId: string) => {
        try {
          const response = await fetch(`/api/user-color?userId=${userId}`);
          const data = await response.json();
          setBorderColor(data.color);
          document.documentElement.style.setProperty(
            "--user-border-color",
            data.color
          );
        } catch (error) {
          console.error("Error fetching user color:", error);
        }
      };

      fetchUserColor(session.user.id);
    }
  }, [session]);

  return (
    <ThemeContext.Provider value={{ borderColor, setBorderColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
