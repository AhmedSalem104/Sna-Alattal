/**
 * Design Tokens
 * Single source of truth for all design values
 * Use these instead of hardcoded values for consistency
 */

// Color Palette
export const colors = {
  // Primary Brand Colors (Industrial Gold)
  primary: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#D4A00A', // Main primary
    600: '#B8860B',
    700: '#92650D',
    800: '#6B4A0F',
    900: '#452F0D',
    DEFAULT: '#D4A00A',
  },

  // Secondary (Copper/Bronze accent)
  secondary: {
    50: '#FDF4ED',
    100: '#FAE5D3',
    200: '#F5CBA7',
    300: '#E8A87C',
    400: '#D4845A',
    500: '#B87333', // Main secondary
    600: '#96582A',
    700: '#724323',
    800: '#4E2E1C',
    900: '#2A1910',
    DEFAULT: '#B87333',
  },

  // Neutral (For text and backgrounds)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F6',
    200: '#E8E8EC',
    300: '#C8C8D4',
    400: '#8E8E9E',
    500: '#5E5E70', // Secondary text
    600: '#454558',
    700: '#353548',
    800: '#252538',
    900: '#18181F', // Primary text
    950: '#0C0C10',
    DEFAULT: '#5E5E70',
  },

  // Steel (Dark backgrounds)
  steel: {
    50: '#F7F7F8',
    100: '#EEEEF0',
    200: '#DCDCE1',
    300: '#B8B8C4',
    400: '#8E8EA0',
    500: '#6B6B7D',
    600: '#4A4A5E',
    700: '#36364A',
    800: '#26263A',
    900: '#1C1C28', // Main dark
    950: '#0E0E14',
    DEFAULT: '#1C1C28',
  },

  // Semantic Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    DEFAULT: '#10B981',
  },

  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    DEFAULT: '#F59E0B',
  },

  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    DEFAULT: '#EF4444',
  },

  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    DEFAULT: '#3B82F6',
  },
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
    arabic: ['var(--font-cairo)', 'Cairo', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],       // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],   // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],      // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],   // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],    // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],     // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],// 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],  // 36px
    '5xl': ['3rem', { lineHeight: '1' }],          // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],       // 60px
    '7xl': ['4.5rem', { lineHeight: '1' }],        // 72px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
} as const;

// Spacing (8px base system)
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const;

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px',
} as const;

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Custom
  soft: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  card: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  cardHover: '0 12px 24px -8px rgba(0, 0, 0, 0.15)',
  gold: '0 4px 16px rgba(212, 160, 10, 0.2)',
} as const;

// Breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-Index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
  toast: 1080,
} as const;

// Animation durations
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;

// Component-specific tokens
export const components = {
  button: {
    height: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem',    // 48px
      xl: '3.5rem', // 56px
    },
    padding: {
      sm: '0 0.75rem',
      md: '0 1rem',
      lg: '0 1.5rem',
      xl: '0 2rem',
    },
  },

  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: '0 0.75rem',
  },

  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: '1rem', // 16px
  },

  navbar: {
    height: '4rem', // 64px
  },
} as const;

// Export utility functions
export const getColor = (path: string): string => {
  const parts = path.split('.');
  let result: unknown = colors;
  for (const part of parts) {
    result = (result as Record<string, unknown>)?.[part];
  }
  return (result as string) || path;
};

export const getSpacing = (key: keyof typeof spacing): string => {
  return spacing[key] || '0';
};

// CSS custom properties generator
export const generateCSSVariables = (): Record<string, string> => {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(colors).forEach(([colorName, shades]) => {
    if (typeof shades === 'object') {
      Object.entries(shades).forEach(([shade, value]) => {
        if (shade === 'DEFAULT') {
          vars[`--color-${colorName}`] = value as string;
        } else {
          vars[`--color-${colorName}-${shade}`] = value as string;
        }
      });
    }
  });

  // Spacing
  Object.entries(spacing).forEach(([key, value]) => {
    vars[`--spacing-${key}`] = value;
  });

  return vars;
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  animation,
  components,
};
