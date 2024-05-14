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
        'pharmaGreen': {
          50: '#deffff',
          100: '#b3fffd',
          200: '#86fefa',
          300: '#5bfef9',
          400: '#40fef7',
          500: '#34e5de',
          600: '#24b2ac',
          700: '#147f7c',
          800: '#004442',
          900: '#001b1a',
        }
      }
    },
  },
  plugins: [],
};
export default config;
