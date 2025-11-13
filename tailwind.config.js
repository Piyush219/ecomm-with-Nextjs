/** @type {import('tailwindcss').Config} */

import animate from 'tailwindcss-animate'

export default {
  theme: {
    extend: {},
  },
  plugins: [
    animate,
    function ({ addUtilities }) {
      addUtilities({
        '.wrapper': {
          'max-width': '80rem', // max-w-7xl
          'margin-left': 'auto',
          'margin-right': 'auto',
          'padding': '1.25rem', // p-5
          'width': '100%',
          '@screen md': {
            'padding-left': '2.5rem', // md:px-10
            'padding-right': '2.5rem',
          },
        },
        '.flex-start': {
          display: 'flex',
          'justify-content': 'flex-start',
          'align-items': 'center',
        },
        '.flex-center': {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.flex-between': {
          display: 'flex',
          'justify-content': 'space-between',
          'align-items': 'center',
        },
        '.h1-bold': {
          'font-weight': '700',
          'font-size': '1.875rem', // text-3xl
          '@screen lg': {
            'font-size': '2.25rem', // lg:text-4xl
          },
        },
        '.h2-bold': {
          'font-weight': '700',
          'font-size': '1.5rem', // text-2xl
          '@screen lg': {
            'font-size': '1.875rem', // lg:text-3xl
          },
        },
        '.h3-bold': {
          'font-weight': '700',
          'font-size': '1.25rem', // text-xl
          '@screen lg': {
            'font-size': '1.5rem', // lg:text-2xl
          },
        },
      })
    },
  ],
}
