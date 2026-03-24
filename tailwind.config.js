/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        popupOpen: {
          "0%": {
            opacity: 0,
            transform: "translateY(-80px) scale(0.95)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },
        popupClose: {
          "0%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
          "100%": {
            opacity: 0,
            transform: "translateY(-80px) scale(0.95)",
          },
        },
      },
      animation: {
        popupOpen: "popupOpen 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        popupClose: "popupClose 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
