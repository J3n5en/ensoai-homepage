/** @type {import('tailwindcss').Config} */
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
          bg: '#f8f9fa',        // background
          fg: '#5c6166',        // foreground
          cursor: '#ffaa33',    // cursor-color
          'cursor-text': '#f8f9fa', // cursor-text
          
          // Switch primary accent to Blue (Palette 12) for better UI balance
          accent: '#399ee6',    
          
          // Secondary/Highlight accent (Orange from cursor/keywords)
          highlight: '#ffaa33', 

          // Ansi Colors Mapped for semantic usage
          black: '#000000',
          red: '#ea6c6d',       // Error/Delete
          green: '#6cbf43',     // Success/String
          yellow: '#eca944',    // Warning/Function
          blue: '#399ee6',      // Info/Entity
          purple: '#a37acc',    // Constant
          cyan: '#4cbf99',      // Regexp
          white: '#ffffff',
          
          // Mapped semantic names
          tag: '#399ee6',       // Blue
          func: '#eca944',      // Yellow
          entity: '#399ee6',    // Blue
          string: '#86b300',    // Bright Green
          regexp: '#4cbf99',    // Cyan
          constant: '#a37acc',  // Purple
          keyword: '#ffaa33',   // Orange
          comment: '#bababa',   // Gray
          
          line: '#f0f0f0',      // Subtle line/border
          panel: '#ffffff',     // Panel/Card background
          
          selection: '#035bd6', // selection-background
          'selection-text': '#f8f9fa', // selection-foreground
        }
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
        'grid-pattern': "linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)",
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
