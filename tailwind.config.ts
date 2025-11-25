import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        air: {
          blue: {
            DEFAULT: "#0096e0",
            hover: "#007bc3",
            light: "#e6f4fb",
          },
          text: {
            DEFAULT: "#333333",
            secondary: "#666666",
          },
          gray: {
            DEFAULT: "#f5f6f7",
            border: "#e0e0e0",
          }
        }
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

