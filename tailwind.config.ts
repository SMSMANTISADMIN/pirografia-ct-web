import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial']
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,.08), 0 20px 60px rgba(0,0,0,.55)',
        soft: '0 0 0 1px rgba(255,255,255,.06), 0 12px 40px rgba(0,0,0,.35)'
      },
      colors: {
        brand: {
          ink: '#0B0F14',
          teal: '#0E3A43',
          teal2: '#0B2A31',
          copper: '#B37A2B',
          copper2: '#8C5C22'
        }
      },
      backgroundImage: {
        'grid-fade': 'radial-gradient(circle at 30% 20%, rgba(255,255,255,.08), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,.06), transparent 42%), linear-gradient(to bottom, rgba(0,0,0,.75), rgba(0,0,0,.85))',
        'hero-radial': 'radial-gradient(900px circle at 15% 15%, rgba(14,58,67,.55), transparent 45%), radial-gradient(720px circle at 85% 25%, rgba(179,122,43,.35), transparent 50%), radial-gradient(800px circle at 65% 85%, rgba(255,255,255,.06), transparent 55%)'
      },
      borderRadius: {
        '2xl': '1.25rem'
      }
    }
  },
  plugins: []
}

export default config
