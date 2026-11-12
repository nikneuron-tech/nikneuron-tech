/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#050612',
          deep: '#020308',
          surface: 'rgba(10, 20, 50, 0.45)',
          hover: 'rgba(16, 28, 68, 0.65)',
        },
        cyan: {
          electric: '#4fd8ff',
          glow: 'rgba(79, 216, 255, 0.45)',
          subtle: 'rgba(79, 216, 255, 0.12)',
        },
        ice: '#e8fbff',
        blue: {
          deep: '#0a3cff',
        },
        pink: {
          accent: '#ff5aa5',
          glow: 'rgba(255, 90, 165, 0.5)',
        },
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(79, 216, 255, 0.4)',
        'cyan-lg': '0 0 45px rgba(79, 216, 255, 0.6)',
        'pink-glow': '0 0 25px rgba(255, 90, 165, 0.45)',
        'glass': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(79, 216, 255, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite alternate',
        'spin-slow': 'spin 18s linear infinite',
        'blob': 'blob 2.5s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%': { opacity: '0.8', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1.02)' },
        },
        blob: {
          '0%, 100%': { transform: 'translateY(8px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
