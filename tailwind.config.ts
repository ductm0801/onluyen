import { transform } from "next/dist/build/swc";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    extend: {
      backgroundImage: {
        welcome: "url(/assets/Welcome.webp)",
        aboutus: "url(/assets/aboutus.webp)",
      },
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
        butonHover: {
          "0%": {
            transform: "translateY(-200%) rotate(20deg)",
          },

          "100%": {
            transform: "translateY(0%) rotate(0deg)",
          },
        },
        butonNoHover: {
          "0%": {
            transform: "translateY(0%) rotate(0deg)",
          },

          "100%": {
            transform: "translateY(-200%) rotate(20deg)",
          },
        },
        butonHover2: {
          "0%": {
            transform: "translateY(0%) rotate(20deg)",
          },
          "100%": {
            transform: "translateY(200%) rotate(0deg)",
          },
        },
        butonNoHover2: {
          "0%": {
            transform: "translateY(200%) rotate(20deg)",
          },

          "100%": {
            transform: "translateY(0%) rotate(0deg)",
          },
        },
        spin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        shimmer: "shimmer 1s infinite linear",
        butonHover: "butonHover 1s forwards",
        buttonHover2: "butonHover2 1s forwards",
        butonNoHover: "butonNoHover 1s forwards",
        butonNoHover2: "butonNoHover2 1s forwards",
      },
    },
  },
  plugins: [],
};
export default config;
