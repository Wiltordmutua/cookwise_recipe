/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#355956',
          hover: '#2F5451',
        },
        secondary: {
          DEFAULT: '#E6DACC',
          hover: '#DDD0C1',
        },
        accent: '#BEC9C8',
        background: '#FFFFFF',
        text: '#2F5451',
      },
      spacing: {
        'section': '2rem',
        'container': '1rem',
      },
      borderRadius: {
        'container': '0.75rem',
      },
    },
  },
  plugins: [],
}
