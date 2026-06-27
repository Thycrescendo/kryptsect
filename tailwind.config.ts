import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        krypt: {
          bg: "#080b10",
          panel: "#10151f",
          card: "#141b29",
          gold: "#f6c343",
          green: "#00c076",
          red: "#f6465d"
        }
      },
      boxShadow: {
        glow: "0 0 80px rgba(246, 195, 67, 0.15)"
      }
    },
  },
  plugins: [],
};
export default config;
