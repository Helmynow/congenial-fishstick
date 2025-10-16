import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ESE Blues (Language Division)
        'blue-primary': '#094773',
        'blue-secondary': '#23547B',
        'blue-tertiary': '#485D7B',
        'blue-accent': '#2D7EA1',
        'blue-light': '#67A1BA',
        'blue-lighter': '#9DC6E1',
        'blue-soft': '#869FC9',
        
        // ESE Greens (International)
        'green-primary': '#2C5B4C',
        'green-secondary': '#5D7D60',
        'green-tertiary': '#487557',
        'green-accent': '#7CA48A',
        'green-light': '#8EB49B',
        'green-lighter': '#E5F6DF',
        'green-soft': '#86C997',
        'green-pale': '#D1DCCD',
        
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
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
      },
      backgroundImage: {
        'gradient-ese': 'linear-gradient(135deg, #094773 0%, #2C5B4C 100%)',
      },
      fontFamily: {
        sans: ['Quicksand', 'ui-sans-serif', 'system-ui'],
        heading: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
