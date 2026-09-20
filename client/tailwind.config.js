/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        // Tokens taken from the Figma export (Design Sol Bracelets)
        sol: {
          red: '#E90707',
          'red-dark': '#C40606',
          ink: '#0F0F0F',
          gray: '#747676',        // body copy
          stroke: '#000000',      // "stroke dark"
          'stroke-light': '#ECECEC',
          page: '#F1F1F1',
          cream: '#FFF0E8',       // hand-made panel / card hover
          blush: '#F8E4E3',       // gallery image panel
          track: '#B1B3B3',       // slider track
        },
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        display: ['Clash Grotesk', 'Bricolage Grotesque', 'sans-serif'],
      },
      borderRadius: {
        pill: '40px',
        card: '12px',
        panel: '25px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          from: { opacity: '0', transform: 'scale(0.7)' },
          '70%': { transform: 'scale(1.06)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        //The tick is a 24-unit path, so one dash length covers it exactly
        'draw-check': {
          from: { strokeDashoffset: '24' },
          to: { strokeDashoffset: '0' },
        },
      },
      animation: {
        //easeOutQuad, so entrances settle instead of stopping dead
        'fade-up': 'fade-up 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'pop-in': 'pop-in 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'draw-check': 'draw-check 320ms cubic-bezier(0.65, 0, 0.35, 1) 260ms both',
      },
    },
  },
  plugins: [
    //require('flowbite/plugin')
  ],
}
