/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
        },
        background: 'var(--color-background)',
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        accent: {
          success: 'var(--color-accent-success)',
          warning: 'var(--color-accent-warning)',
          danger: 'var(--color-accent-danger)',
        }
      }
    }
  },
  plugins: [],
};
