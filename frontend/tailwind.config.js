/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0c',
        'neon-blue': '#00d4ff',
      },
      boxShadow: {
        'neon-blue': '0 0 24px rgba(0, 212, 255, 0.6)',
      },
      fontFamily: {
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1.25rem',
      },
      backdropBlur: {
        glass: '18px',
      },
    },
  },
  plugins: [],
};

