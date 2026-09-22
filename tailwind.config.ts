import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter-tight)", "Arial Narrow", "Arial", "sans-serif"],
        patung: ["var(--font-patung)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
