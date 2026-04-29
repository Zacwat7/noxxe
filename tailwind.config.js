/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        bone: '#F5F5F0',
        ash: '#E8E8E3',
        electric: '#2050FF',
        gold: '#C9A961',
      },
      fontFamily: {
        display: ['"Bodoni Moda"', '"Didot"', 'serif'],
        editorial: ['"Fraunces"', '"Bodoni Moda"', '"Didot"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.18em',
        widest2: '0.32em',
      },
    },
  },
  plugins: [],
};
