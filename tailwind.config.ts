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
        brand: {
          // Purple and lavender brand palette
          primary: "#6A2FC8",       
          primaryDark: "#25134D",
          primaryLight: "#F2E9FF",
          teal: "#6A2FC8",          
          tealLight: "#F2E9FF",
          amber: "#6A2FC8",         
          amberHover: "#25134D",
          emerald: "#059669",
          emeraldLight: "#ecfdf5",
          navy: "#0B0720",
        },
      },
    },
  },
  plugins: [],
};
export default config;
