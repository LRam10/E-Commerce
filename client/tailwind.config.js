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
    },
  },
  plugins: [
    //require('flowbite/plugin')
  ],
}
