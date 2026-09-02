/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6ED",
        ink: "#2B2420",
        cloth: {
          DEFAULT: "#2F4C5C",
          light: "#3D6377",
          dark: "#213640",
        },
        marigold: {
          DEFAULT: "#E0883E",
          light: "#F0A868",
          dark: "#B5692A",
        },
        leaf: {
          DEFAULT: "#4C7A52",
          light: "#E7F0E4",
        },
        amberwarn: {
          DEFAULT: "#B8792A",
          light: "#FBF0DD",
        },
        brick: {
          DEFAULT: "#B14A38",
          light: "#FAE6E1",
        },
        line: "#E3D9C6",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
      boxShadow: {
        soft: "0 2px 14px rgba(43, 36, 32, 0.06)",
      },
    },
  },
  plugins: [],
};
