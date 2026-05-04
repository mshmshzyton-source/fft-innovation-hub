import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0b0f19',
        surface: 'rgba(30, 41, 59, 0.7)',
        surfaceSolid: '#1e293b',
        primary: '#8b5cf6',
        primaryHover: '#7c3aed',
        secondary: '#3b82f6',
        secondaryHover: '#2563eb',
        accent: '#f43f5e',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.15) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['Tajawal', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
