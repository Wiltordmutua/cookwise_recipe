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
          DEFAULT: '#2E473B', // dark green
          hover: '#254036',
        },
        secondary: {
          DEFAULT: '#5C3A1C', // brown
          hover: '#4A2E16',
        },
        accent: '#CBB37B', // gold
        background: '#F7F3E8', // cream
        text: '#1A1A1A', // near-black
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
