import { transform } from "next/dist/build/swc";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        shimmer: {
          "0%": {
            transform: "scale(1)",
          },
          "50%": { transform: "scale(0.5)" },
          "100%": {
            transform: "scale(1)",
          },
        },
      },
      animation: {
        shimmer: "shimmer 1s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
