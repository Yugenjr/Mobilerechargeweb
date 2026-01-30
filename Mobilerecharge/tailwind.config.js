/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand
        primary: {
          light: '#2563EB', // Blue
          DEFAULT: '#2563EB',
          dark: '#7C3AED', // Violet
        },
        // Accent
        accent: {
          teal: '#22D3EE',
        },
        // Critical / Alerts
        critical: {
          red: '#EF4444',
          amber: '#F59E0B',
        },
        // Dark Mode System
        dark: {
          bg: '#0B0F1A',
          surface: '#12182A',
          elevated: '#161D33',
          border: 'rgba(255,255,255,0.06)',
          text: {
            primary: '#E5E7EB',
            secondary: '#9CA3AF',
            muted: '#6B7280',
          }
        },
        // Light Mode System
        light: {
          bg: '#F6F7FB',
          surface: '#FFFFFF',
          elevated: '#F1F5F9',
          border: '#E5E7EB',
          text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#64748B',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glow-sm': '0 0 10px rgba(37, 99, 235, 0.2)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)',
        'gradient-surface': 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
      },
      opacity: {
        '8': '0.08',
        '14': '0.14',
      },
      borderRadius: {
        'card': '16px', // 14-18px range
      }
    },
  },
  darkMode: 'class', // Enable manual dark mode toggle support
  plugins: [],
}
