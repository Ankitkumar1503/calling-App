/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        gradientStart: "#0F2027",
        gradientMid: "#203A43",
        gradientEnd: "#2C5364",
      },
      backgroundImage: {
        'auth-gradient': 'linear-gradient(to bottom, #0F2027, #203A43, #2C5364)',
      },
    },
  },
  plugins: [],
};
