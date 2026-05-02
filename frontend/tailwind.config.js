/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f5f5f0',
          100: '#e8e8e0',
          200: '#d0d0c4',
          300: '#a8a898',
          400: '#7a7a6c',
          500: '#555548',
          600: '#3a3a30',
          700: '#2a2a22',
          800: '#1e1e18',
          900: '#141410',
          950: '#0a0a08',
        },
        ember: {
          400: '#ff7b4f',
          500: '#ff5c28',
          600: '#e84b18',
        },
        jade: {
          400: '#4fcd8e',
          500: '#28b870',
          600: '#1a9a58',
        },
      },
    },
  },
  plugins: [],
}
