/** @type {import('tailwindcss').Config} */
// ayu-* tokens are plain var() strings, so Tailwind drops their /opacity modifiers;
// ayu-a-* are alpha-capable aliases of the same theme variables.
const ayuAlpha = (name) =>
  `color-mix(in srgb, var(--ayu-${name}) calc(<alpha-value> * 100%), transparent)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"JetBrains Mono"',
          '"Fira Code"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        // Corrected Ayu Light Palette
        ayu: {
          bg: 'var(--ayu-bg)',
          fg: 'var(--ayu-fg)',
          cursor: 'var(--ayu-cursor)',
          'cursor-text': 'var(--ayu-cursor-text)',
          
          // Switch primary accent to Blue (Palette 12) for better UI balance
          accent: 'var(--ayu-accent)',
          
          // Secondary/Highlight accent (Orange from cursor/keywords)
          highlight: 'var(--ayu-highlight)',

          // Ansi Colors Mapped for semantic usage
          black: 'var(--ayu-black)',
          red: 'var(--ayu-red)',
          green: 'var(--ayu-green)',
          yellow: 'var(--ayu-yellow)',
          blue: 'var(--ayu-blue)',
          purple: 'var(--ayu-purple)',
          cyan: 'var(--ayu-cyan)',
          white: 'var(--ayu-white)',
          
          // Mapped semantic names
          tag: 'var(--ayu-tag)',
          func: 'var(--ayu-func)',
          entity: 'var(--ayu-entity)',
          string: 'var(--ayu-string)',
          regexp: 'var(--ayu-regexp)',
          constant: 'var(--ayu-constant)',
          keyword: 'var(--ayu-keyword)',
          comment: 'var(--ayu-comment)',
          
          line: 'var(--ayu-line)',
          panel: 'var(--ayu-panel)',
          
          selection: 'var(--ayu-selection)',
          'selection-text': 'var(--ayu-selection-text)',
        },
        'ayu-a': Object.fromEntries(
          ['bg', 'fg', 'accent', 'line', 'panel', 'red', 'green', 'yellow'].map((name) => [name, ayuAlpha(name)]),
        ),
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.05)',
        'panel': '0 8px 30px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, var(--ayu-line) 1px, transparent 1px), linear-gradient(to bottom, var(--ayu-line) 1px, transparent 1px)",
      },
      keyframes: {
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
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.transform-style-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      })
    }
  ],
}
