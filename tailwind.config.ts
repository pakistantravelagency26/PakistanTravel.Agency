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
          midnight: "#0B0720",    // Deepest midnight indigo/black (#0B0720)
          deep: "#25134D",        // Royal dark purple surface (#25134D)
          primary: "#6A2FC8",     // Vibrant primary purple (#6A2FC8)
          primaryDark: "#541FB3", // Darker royal purple
          accent: "#9D71E8",      // Medium soft purple accent (#9D71E8)
          lilac: "#D1B8FF",       // Light lilac / lavender (#D1B8FF)
          mist: "#F2E9FF",        // Ultra-soft lavender mist (#F2E9FF)
          teal: "#9D71E8",
          tealLight: "#F2E9FF",
          amber: "#f97316",
          amberHover: "#ea580c",
          emerald: "#6A2FC8",
          emeraldLight: "#F2E9FF",
          navy: "#0B0720",
        },
        // Override emerald so all existing 1,076+ emerald classes seamlessly adopt the purple theme
        emerald: {
          50: "#FAF7FF",
          100: "#F2E9FF", // exact #F2E9FF from palette
          200: "#E5D4FF",
          300: "#D1B8FF", // exact #D1B8FF from palette
          400: "#B692F6",
          500: "#9D71E8", // exact #9D71E8 from palette
          600: "#6A2FC8", // exact #6A2FC8 primary from palette
          700: "#541FB3",
          800: "#3D1680",
          900: "#25134D", // exact #25134D from palette
          950: "#0B0720", // exact #0B0720 from palette
        },
        // Map sky to vibrant purple/violet spectrum
        sky: {
          50: "#FAF7FF",
          100: "#F2E9FF",
          200: "#E5D4FF",
          300: "#D1B8FF",
          400: "#B692F6",
          500: "#9D71E8",
          600: "#6A2FC8",
          700: "#541FB3",
          800: "#3D1680",
          900: "#25134D",
          950: "#0B0720",
        },
        // Map teal to complementary soft violet
        teal: {
          50: "#FAF7FF",
          100: "#F2E9FF",
          200: "#E5D4FF",
          300: "#D1B8FF",
          400: "#B692F6",
          500: "#9D71E8",
          600: "#6A2FC8",
          700: "#541FB3",
          800: "#3D1680",
          900: "#25134D",
          950: "#0B0720",
        },
      },
    },
  },
  plugins: [],
};
export default config;
