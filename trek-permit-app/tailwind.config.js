/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#20241F',
        canvas: '#EAEDE4',
        paper: '#FBFAF4',
        moss: {
          DEFAULT: '#2F5233',
          light: '#436B48',
          dark: '#1E3620',
        },
        ochre: {
          DEFAULT: '#B8792E',
          light: '#D3934A',
          dark: '#8F5D22',
        },
        slate: {
          DEFAULT: '#6B6F62',
          light: '#9A9D8E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
