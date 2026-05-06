import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg0:          'var(--bg0)',
        s1:           'var(--s1)',
        s2:           'var(--s2)',
        s3:           'var(--s3)',
        t1:           'var(--t1)',
        t2:           'var(--t2)',
        t3:           'var(--t3)',
        emerald:      'var(--emerald)',
        'emerald-dim':'var(--emerald-dim)',
        'emerald-t':  'var(--emerald-t)',
        amber:        'var(--amber)',
        'amber-dim':  'var(--amber-dim)',
        'amber-t':    'var(--amber-t)',
        coral:        'var(--coral)',
        'coral-dim':  'var(--coral-dim)',
        'coral-t':    'var(--coral-t)',
        blue:         'var(--blue)',
        'blue-dim':   'var(--blue-dim)',
        'blue-t':     'var(--blue-t)',
        pink:         'var(--pink)',
        'pink-dim':   'var(--pink-dim)',
        'pink-t':     'var(--pink-t)',
      },
      borderRadius: {
        input: 'var(--r-input)',
        card:  'var(--r-card)',
        sheet: 'var(--r-sheet)',
        pill:  'var(--r-pill)',
      },
      spacing: {
        'page-x': '16px',
        'page-y': '20px',
        section:  '24px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        mobile: '390px',
      },
    },
  },
  plugins: [],
} satisfies Config
