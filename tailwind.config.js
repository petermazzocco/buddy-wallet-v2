/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        buddywallet: {
          primary: "#666B6A",

          secondary: "#f2a521",

          accent: "#E9DEC4",

          neutral: "#141524",

          "base-100": "#eaebf0",

          info: "#68b0cf",

          success: "#67e4a6",

          warning: "#ed851d",

          error: "#f8726d",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
