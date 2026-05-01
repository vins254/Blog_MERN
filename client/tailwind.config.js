module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1a1814',
          light: '#5c5750',
          faint: '#9c958c',
        },
        paper: {
          DEFAULT: '#faf8f3',
          warm: '#f5f2eb',
        },
        accent: {
          DEFAULT: '#c0392b',
          teal: '#2c7a7b',
        },
        surface: '#ffffff',
        'border-custom': '#e5e0d5',
        'border-dark': '#cec9be',
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
