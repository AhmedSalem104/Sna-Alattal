import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        // Industrial Primary - Gold
        primary: {
          DEFAULT: '#D4A00A',
          50: '#FDF8E7',
          100: '#FCF0C3',
          200: '#F9E08A',
          300: '#F5CF51',
          400: '#EABC1A',
          500: '#D4A00A',
          600: '#B8860B',
          700: '#8B6914',
          800: '#5C4A16',
          900: '#2D2509',
          foreground: '#0A0A0A',
        },

        // Industrial Secondary - Steel
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },

        // Industrial Dark Colors - Steel/Metal
        steel: {
          DEFAULT: '#1A1A2E',
          50: '#F4F4F6',
          100: '#E4E4E9',
          200: '#C9C9D3',
          300: '#A3A3B3',
          400: '#71718A',
          500: '#4A4A62',
          600: '#2D3142',
          700: '#232538',
          800: '#1A1A2E',
          900: '#0F0F1A',
          950: '#08080D',
        },

        // Industrial Metal Gray
        metal: {
          DEFAULT: '#2D3142',
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',
          800: '#2D3142',
          900: '#212529',
        },

        // Legacy dark colors (for compatibility)
        dark: {
          DEFAULT: '#1E293B',
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },

        // Industrial Gold (extended)
        gold: {
          DEFAULT: '#D4A00A',
          light: '#F4D03F',
          dark: '#B8860B',
          50: '#FDF8E7',
          100: '#FCF0C3',
          200: '#F9E08A',
          300: '#F5CF51',
          400: '#EABC1A',
          500: '#D4A00A',
          600: '#B8860B',
          700: '#8B6914',
          800: '#5C4A16',
          900: '#2D2509',
        },

        // Industrial Status Colors
        industrial: {
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },

      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        arabic: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        industrial: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        // Industrial: Sharp edges
        'industrial': '0px',
        'industrial-sm': '2px',
        'industrial-md': '4px',
      },

      boxShadow: {
        // Industrial shadows - Sharp, directional
        'industrial-sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'industrial': '0 4px 8px rgba(0, 0, 0, 0.15)',
        'industrial-md': '0 6px 12px rgba(0, 0, 0, 0.2)',
        'industrial-lg': '0 8px 24px rgba(0, 0, 0, 0.25)',
        'industrial-xl': '0 12px 48px rgba(0, 0, 0, 0.3)',
        // Gold glow
        'gold-sm': '0 2px 8px rgba(212, 160, 10, 0.2)',
        'gold': '0 4px 16px rgba(212, 160, 10, 0.3)',
        'gold-lg': '0 8px 32px rgba(212, 160, 10, 0.4)',
        // Offset shadow (industrial feel)
        'offset': '4px 4px 0 #1A1A2E',
        'offset-sm': '2px 2px 0 #1A1A2E',
        'offset-gold': '4px 4px 0 #D4A00A',
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulse-gold': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 160, 10, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 160, 10, 0)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gear-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'slide-in-left': 'slide-in-left 0.4s ease-out',
        'scale-in': 'scale-in 0.3s ease-out',
        'pulse-gold': 'pulse-gold 2s infinite',
        'count-up': 'count-up 0.8s ease-out',
        'gear-spin': 'gear-spin 8s linear infinite',
        'gear-spin-slow': 'gear-spin 12s linear infinite',
      },

      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },

      backgroundImage: {
        // Industrial gradients
        'gradient-industrial': 'linear-gradient(135deg, #2D3142 0%, #1A1A2E 100%)',
        'gradient-steel': 'linear-gradient(180deg, #2D3142 0%, #1A1A2E 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A00A 0%, #B8860B 100%)',
        'gradient-gold-shine': 'linear-gradient(90deg, #D4A00A 0%, #F4D03F 50%, #D4A00A 100%)',
        // Metal texture overlay
        'metal-texture': 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        // Diagonal stripes (industrial pattern)
        'industrial-stripes': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(212, 160, 10, 0.05) 10px, rgba(212, 160, 10, 0.05) 20px)',
      },

      transitionTimingFunction: {
        'industrial': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },

      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
