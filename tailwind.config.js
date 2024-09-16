/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: "#635FC7",
          secondary: "#2B2C37",
          tertiary: "#3E3F4E",
          background: "#000112",
          text: "#828FA3",
        },

        light: {
          primary: "#A8A4FF",
          background: "#F4F7FD",
          text: "#E4EBFA",
          white: "#FFFFFF",
        },

        accent: {
          danger: "#EA5555",
          warning: "#FF9898",
        },
      },
    },
  },
  plugins: [],
};
