import type { Config } from 'tailwindcss'

// RouteBench: a transit-map identity. Each model in the catalogue is a coloured "line";
// the router is the junction. Crisp white ground, ink type, signal-orange primary.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      colors: {
        rb: {
          bg: '#FFFFFF',
          wash: '#F4F5F8',
          line: '#E5E7EE',
          line2: '#D3D7E2',
          ink: '#0C0E14',
          ink2: '#2A2F3D',
          muted: '#5F6678',
          dim: '#8C93A6',
          orange: '#FF5B1F',
          teal: '#00A38C',
          violet: '#6A4BFF',
          yellow: '#F2B400',
          sky: '#1D8CF0',
          pink: '#E5487D',
          night: '#0C0E14',
        },
      },
      letterSpacing: { tightest: '-0.04em' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        rise: { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
        pulseDot: { '50%': { opacity: '0.35' } },
        dash: { to: { strokeDashoffset: '-24' } },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        rise: 'rise .8s cubic-bezier(.2,.7,.2,1) both',
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
        dash: 'dash 0.9s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
