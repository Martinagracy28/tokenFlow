/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0B0F',
        surface: '#0F1117',
        card: '#161B27',
        elevated: '#1E2535',
        border: {
          DEFAULT: '#1E2535',
          hover: '#2A3347',
          active: '#3D4F6B',
        },
        accent: {
          DEFAULT: '#6C63FF',
          hover: '#4F46E5',
          glow: '#8B83FF',
          muted: '#6C63FF20',
        },
        primary: '#6C63FF',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        text: {
          primary: '#F0F4FF',
          secondary: '#8B9ABE',
          muted: '#4A5568',
        },
      },
      borderRadius: {
        card: '20px',
        button: '14px',
        input: '14px',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px #6C63FF40',
        'glow-lg': '0 0 40px #6C63FF60',
        card: '0 4px 24px #00000040',
        'card-hover': '0 12px 32px -8px #00000080, 0 0 0 1px #6C63FF30',
      },

      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #6C63FF40' },
          '50%': { opacity: '0.7', boxShadow: '0 0 40px #6C63FF60' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeInUp: 'fadeInUp 0.4s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-success',
    'text-warning',
    'text-danger',
    'bg-success/10',
    'bg-warning/10',
    'bg-danger/10',
    'border-success/30',
    'border-warning/30',
    'border-danger/30',
  ],
}

export default config
