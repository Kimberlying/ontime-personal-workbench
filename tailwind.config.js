/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sage & Nordic Spruce Palette (鼠尾草松针绿 · 极度护眼)
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488', // Primary Nordic Teal
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        spruce: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        cobalt: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.08)',
        'hard-sm': '2px 2px 0px 0px #0f172a',
        'hard': '3px 3px 0px 0px #0f172a',
        'hard-lg': '5px 5px 0px 0px #0f172a',
        'hard-teal-sm': '2px 2px 0px 0px #0d9488',
        'hard-teal': '3px 3px 0px 0px #0d9488',
        'hard-teal-lg': '5px 5px 0px 0px #0d9488',
        'hard-cobalt-sm': '2px 2px 0px 0px #0d9488',
        'hard-cobalt': '3px 3px 0px 0px #0d9488',
        'hard-cobalt-lg': '5px 5px 0px 0px #0d9488',
        'hard-amber': '3px 3px 0px 0px #d97706',
        'hard-emerald': '3px 3px 0px 0px #059669',
        'hard-rose': '3px 3px 0px 0px #e11d48',
      }
    },
  },
  plugins: [],
}
