import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryBlue: "#3b82f6",
        primaryGray: "#808080",
        hoverBlue: "#1d4ed8",
        lightHover: "#E5E5E5",
        lightActive: "#CCC",
        darkHover: "#1A1A1A",
        darkActive: "#333",
        lightBorder: "#e5e7eb",
        lightBorderHover: "##B5BAC3",
        darkBorder: "#111827",
        darkBorderHover: "#1f2937",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  darkMode: ["class"],
};
export default config;
