/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#55B9A6',
          lime: '#8ED052',
          gradient: 'linear-gradient(135deg, #55B9A6 0%, #8ED052 100%)',
        },
        anthropic: {
          surface: '#FDFCFB',
          black: '#111111',
          muted: '#6B6B6B',
          border: '#E8E8E8',
        },
        'light-blue': {
          DEFAULT: '#E1F1F8',
          text: '#2C5E7D',
        },
        'light-green': {
          DEFAULT: '#E8F5E9',
          text: '#2E7D32',
        },
        forest: {
          DEFAULT: '#111111', // Anthropic style: black text/buttons
          light: '#E8F5E9',
          dark: '#000000',
        },
        navy: {
          DEFAULT: '#111111',
          muted: '#666666',
        }
      },
      fontFamily: {
        display: ['"Newsreader"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        'display-lg': ['clamp(48px, 8vw, 72px)', { lineHeight: '1.05', fontWeight: '400', letterSpacing: '-0.02em' }],
        'display': ['clamp(36px, 6vw, 54px)', { lineHeight: '1.1', fontWeight: '400', letterSpacing: '-0.01em' }],
        'h1': ['clamp(30px, 5vw, 42px)', { lineHeight: '1.2', fontWeight: '400' }],
        'h2': ['clamp(24px, 4vw, 32px)', { lineHeight: '1.3', fontWeight: '400' }],
        'h3': ['clamp(20px, 3vw, 24px)', { lineHeight: '1.4', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'card': '4px', // Anthropic uses very small or zero radius
        'pill': '9999px',
        'anthropic': '2px',
      },
      boxShadow: {
        'anthropic': '0 1px 3px rgba(0,0,0,0.05)',
        'elevated': '0 20px 40px rgba(0,0,0,0.04)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        'content': '1100px', // Slightly narrower for better readability
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'reveal': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
