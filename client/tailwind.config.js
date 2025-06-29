/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#111827',
        },
        chat: {
          DEFAULT: '#1f2937',
        },
        accent: {
          DEFAULT: '#818cf8',
          focus: '#6366f1',
        },
        text: {
          DEFAULT: '#e5e7eb',
          secondary: '#9ca3af',
        },
        timestamp: '#9ca3af',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31,41,55,0.37)',
        accent: '0 0 8px 2px #818cf8',
      },
      backdropBlur: {
        xs: '2px',
        md: '8px',
      },
      fontFamily: {
        display: ['Inter', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #818cf8' },
          '100%': { boxShadow: '0 0 20px #818cf8, 0 0 30px #818cf8' },
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
} 