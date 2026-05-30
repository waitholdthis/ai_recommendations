import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#07070F',
        surface: {
          DEFAULT: '#0D0D1A',
          2: '#121225',
          3: '#18183A',
        },
        line: {
          DEFAULT: '#1C1C30',
          bright: '#252540',
        },
        primary: {
          DEFAULT: '#6366F1',
          light: '#818CF8',
          muted: '#3D3F8F',
        },
        violet: '#A78BFA',
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        ink: {
          1: '#EDEDFA',
          2: '#9090B0',
          3: '#45455F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.06), 0 4px 32px rgba(0,0,0,0.5)',
        'card-hover': '0 0 0 1px rgba(99,102,241,0.3), 0 8px 48px rgba(0,0,0,0.6)',
        glow: '0 0 40px rgba(99,102,241,0.2)',
        'glow-sm': '0 0 20px rgba(99,102,241,0.15)',
        'glow-lg': '0 0 80px rgba(99,102,241,0.25)',
        'input-focus': '0 0 0 3px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.6)',
        'btn-primary': '0 1px 0 rgba(255,255,255,0.12) inset, 0 4px 16px rgba(99,102,241,0.3)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #A78BFA 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(167,139,250,0.04) 100%)',
        'grid-faint': 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        'shimmer': 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'float': 'float 8s ease-in-out infinite',
        'bar-fill': 'bar-fill 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'bar-fill': {
          '0%': { width: '0%' },
          '100%': { width: 'var(--bar-width)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
