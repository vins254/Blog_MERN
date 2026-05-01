module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: 'var(--ink)',
          light: 'var(--ink-light)',
          faint: 'var(--ink-faint)',
        },
        paper: {
          DEFAULT: 'var(--paper)',
          warm: 'var(--paper-warm)',
        },
        accent: {
          DEFAULT: '#c0392b',
          teal: '#2c7a7b',
        },
        surface: 'var(--surface)',
        'border-custom': 'var(--border)',
        'border-dark': 'var(--border-dark)',
      },
      fontFamily: {
        serif: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(26,24,20,.06)',
        sm: '0 2px 8px rgba(26,24,20,.08)',
        DEFAULT: '0 4px 20px rgba(26,24,20,.1)',
        lg: '0 12px 40px rgba(26,24,20,.12)',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        lg: '14px',
      },
    },
  },
  plugins: [],
}
