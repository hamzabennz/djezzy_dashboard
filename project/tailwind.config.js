/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f5f7fa',
          100: '#eaeef4',
          200: '#d0dbe8',
          300: '#a6bcd5',
          400: '#759abe',
          500: '#5380a7',
          600: '#3e648a',
          700: '#325171',
          800: '#24395a',
          900: '#1e304b',
          950: '#0F172A',
        },
        teal: {
          50: '#effef7',
          100: '#d7faed',
          200: '#b2f2dd',
          300: '#7ee5c7',
          400: '#46d0ac',
          500: '#2cb894',
          600: '#0D9488',
          700: '#157261',
          800: '#155a4f',
          900: '#144a42',
          950: '#0a2a27',
        },
      },
      animation: {
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideUp': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        ping: {
          '0%': { transform: 'scale(1)', opacity: '0.8' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};