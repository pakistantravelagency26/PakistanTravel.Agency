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
          // Musandam Tours inspired clean, light ocean & coastal palette
          primary: "#0284c7",       // Ocean blue
          primaryDark: "#0369a1",
          primaryLight: "#f0f9ff",
          teal: "#0d9488",          // Fjord / Lake turquoise
          tealLight: "#f0fdfa",
          amber: "#f97316",         // Sunset warm orange CTA
          amberHover: "#ea580c",
          emerald: "#059669",
          emeraldLight: "#ecfdf5",
          navy: "#0f172a",
        },
      },
    },
  },
  plugins: [],
};
export default config;
