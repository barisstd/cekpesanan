/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF5FF",
        ink: "#332942",
        cloth: {
          DEFAULT: "#7C4FB0",
          light: "#B49BDB",
          dark: "#5E3A8C",
        },
        marigold: {
          DEFAULT: "#E2568F",
          light: "#F7B8D3",
          dark: "#B93A6E",
        },
        leaf: {
          DEFAULT: "#4C9A6B",
          light: "#E3F5EA",
        },
        amberwarn: {
          DEFAULT: "#C98A2E",
          light: "#FDF0DC",
        },
        brick: {
          DEFAULT: "#E2543F",
          light: "#FBE3DE",
        },
        line: "#E7DFF5",
      },
      fontFamily: {
        display: ["Baloo 2", "Fraunces", "Georgia", "serif"],
        body: ["Quicksand", "Plus Jakarta Sans", "system-ui", "sans-serif"],
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
