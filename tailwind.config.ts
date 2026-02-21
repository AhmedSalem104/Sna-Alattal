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

        // Modern Industrial Primary - Warm Gold (refined)
        primary: {
          DEFAULT: '#C9A227',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#C9A227',
          600: '#A88B1F',
          700: '#8B7E2A',
          800: '#713F12',
          900: '#422006',
          950: '#1a0f03',
          foreground: '#18181B',
        },

        // Secondary - Warm accent (Copper/Bronze)
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },

        // Accent Colors - Modern additions
        copper: {
          DEFAULT: '#B87333',
          50: '#FDF4ED',
          100: '#FAE5D3',
          200: '#F5CBA7',
          300: '#E8A87C',
          400: '#D4845A',
          500: '#B87333',
          600: '#96582A',
          700: '#724323',
          800: '#4E2E1C',
          900: '#2A1910',
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

        // Modern Steel - Slightly warmer
        steel: {
          DEFAULT: '#1C1C28',
          50: '#F7F7F8',
          100: '#EEEEF0',
          200: '#DCDCE1',
          300: '#B8B8C4',
          400: '#8E8EA0',
          500: '#6B6B7D',
          600: '#4A4A5E',
          700: '#36364A',
          800: '#26263A',
          900: '#1C1C28',
          950: '#0E0E14',
        },

        // Modern Neutral - Warmer grays
        neutral: {
          DEFAULT: '#525264',
          50: '#FAFAFA',
          100: '#F5F5F6',
          200: '#E8E8EC',
          300: '#D4D4DC',
          400: '#A3A3B2',
          500: '#737385',
          600: '#525264',
          700: '#3D3D4D',
          800: '#27273A',
          900: '#18181F',
          950: '#0C0C10',
        },

        // Legacy metal (updated to be warmer)
        metal: {
          DEFAULT: '#3D3D4D',
          50: '#FAFAFA',
          100: '#F4F4F5',
          200: '#E4E4E7',
          300: '#D4D4D8',
          400: '#A1A1AA',
          500: '#71717A',
          600: '#52525B',
          700: '#3F3F46',
          800: '#27272A',
          900: '#18181B',
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

        // Gold extended (kept for compatibility)
        gold: {
          DEFAULT: '#C9A227',
          light: '#E8C547',
          dark: '#8B7E2A',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#C9A227',
          600: '#A88B1F',
          700: '#8B7E2A',
          800: '#713F12',
          900: '#422006',
        },

        // Status Colors - Improved contrast (WCAG compliant)
        industrial: {
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#2563EB',
        },

        // Semantic success/error - Darker for better contrast
        success: {
          DEFAULT: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          DEFAULT: '#D97706',
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          DEFAULT: '#DC2626',
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        info: {
          DEFAULT: '#2563EB',
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },

      fontFamily: {
        // Cairo unified for all languages (Arabic + English)
        sans: ['var(--font-cairo)', 'Cairo', 'system-ui', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'Cairo', 'sans-serif'],

        arabic: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      borderRadius: {
        // Industrial: sharp corners everywhere
        'none': '0px',
        'xs': '0px',
        'sm': '0px',
        'DEFAULT': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'modern-sm': '0px',
        'modern': '0px',
        'modern-lg': '0px',
        'modern-xl': '0px',
        'modern-2xl': '0px',
        'full': '9999px', // circles preserved for spinners, badges, avatars
      },

      boxShadow: {
        // Modern shadows - Layered, softer
        'soft-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'soft-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'soft-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'soft-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'soft-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        // Elevation shadows (Material-like)
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)',
        'elevation-3': '0 10px 20px rgba(0,0,0,0.15), 0 3px 6px rgba(0,0,0,0.1)',
        'elevation-4': '0 15px 25px rgba(0,0,0,0.15), 0 5px 10px rgba(0,0,0,0.05)',
        'elevation-5': '0 20px 40px rgba(0,0,0,0.2)',
        // Gold glow - Modern
        'gold-glow': '0 0 20px rgba(212, 160, 10, 0.15)',
        'gold-glow-lg': '0 0 40px rgba(212, 160, 10, 0.2)',
        // Card hover
        'card-hover': '0 12px 24px -8px rgba(0, 0, 0, 0.15)',
        // Inner shadows
        'inner-soft': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        // Legacy (kept for compatibility)
        'industrial-sm': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'industrial': '0 4px 8px rgba(0, 0, 0, 0.1)',
        'industrial-md': '0 6px 16px rgba(0, 0, 0, 0.12)',
        'industrial-lg': '0 8px 24px rgba(0, 0, 0, 0.14)',
        'industrial-xl': '0 12px 48px rgba(0, 0, 0, 0.18)',
        'gold-sm': '0 2px 8px rgba(212, 160, 10, 0.15)',
        'gold': '0 4px 16px rgba(212, 160, 10, 0.2)',
        'gold-lg': '0 8px 32px rgba(212, 160, 10, 0.25)',
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
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-out': {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.96)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 160, 10, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(212, 160, 10, 0.4)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'reveal-up': {
          '0%': { clipPath: 'inset(100% 0 0 0)' },
          '100%': { clipPath: 'inset(0 0 0 0)' },
        },
        'slide-in-bottom': {
          '0%': { transform: 'translateY(100px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '50%': { transform: 'scale(1.1) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
      },

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'fade-down': 'fade-down 0.4s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-in-left': 'slide-in-left 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'marquee': 'marquee 30s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'reveal-up': 'reveal-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-bottom': 'slide-in-bottom 0.5s ease-out',
        'ken-burns': 'ken-burns 20s ease-in-out infinite',
      },

      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '32rem',
      },

      backgroundImage: {
        // Modern gradients
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        // Premium gold gradient
        'gradient-gold': 'linear-gradient(135deg, #D4A00A 0%, #F4D03F 50%, #D4A00A 100%)',
        'gradient-gold-subtle': 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.06) 100%)',
        // Dark gradients
        'gradient-dark': 'linear-gradient(180deg, #1C1C28 0%, #0E0E14 100%)',
        'gradient-dark-radial': 'radial-gradient(ellipse at center, #26263A 0%, #1C1C28 70%)',
        // Subtle patterns
        'dots-pattern': 'radial-gradient(circle, rgba(212,160,10,0.1) 1px, transparent 1px)',
        'grid-pattern': 'linear-gradient(rgba(212,160,10,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,160,10,0.03) 1px, transparent 1px)',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'ease-out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },

      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
