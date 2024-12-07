/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-blue1': '#1A73E8', // Lighter blue
        'custom-blue-dark': '#1757C2', // Darker blue
      },
    },
  },
  plugins: [],
};
  