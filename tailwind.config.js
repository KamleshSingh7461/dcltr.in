/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Near-black neutral scale — the entire brand system is monochrome
        ink: {
          50: '#F6F6F7',
          100: '#EBEBED',
          200: '#D3D3D8',
          300: '#AFAFB8',
          400: '#87878F',
          500: '#666670',
          600: '#4D4D57',
          700: '#38383F',
          800: '#232328',
          900: '#151518',
          950: '#0A0A0C',
        },
        // Legacy admin-vault palette (kept for dark surfaces already in use)
        obsidian: {
          950: '#040406',
          900: '#08080B',
          850: '#0E0E13',
          800: '#14141A',
          750: '#1A1A22',
          700: '#24242F',
          600: '#383848',
          500: '#525266',
        },
        gold: {
          100: '#FAF6EB',
          200: '#F5ECD0',
          300: '#EAD7A3',
          400: '#DFC276',
          500: '#D4AF37',
          600: '#B89326',
          700: '#947318',
          800: '#6E530D',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        cinzel: ['Cinzel', 'Georgia', 'serif'],
      },
      boxShadow: {
        pop: '3px 3px 0 0 rgba(10, 10, 12, 1)',
        'pop-lg': '6px 6px 0 0 rgba(10, 10, 12, 1)',
        'pop-sm': '2px 2px 0 0 rgba(10, 10, 12, 1)',
      },
      letterSpacing: {
        'widest-plus': '0.25em',
        'super': '0.35em',
        'epic': '0.45em',
      },
      animation: {
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(6px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
