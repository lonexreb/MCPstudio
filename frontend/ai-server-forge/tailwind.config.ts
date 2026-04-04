
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// MCP Platform specific colors
				mcp: {
					blue: {
						DEFAULT: '#3b82f6',
						50: '#eff6ff',
						100: '#dbeafe',
						200: '#bfdbfe',
						300: '#93c5fd',
						400: '#60a5fa',
						500: '#3b82f6',
						600: '#2563eb',
						700: '#1d4ed8',
						800: '#1e40af',
						900: '#1e3a8a',
					},
					purple: {
						DEFAULT: '#8b5cf6',
						50: '#f5f3ff',
						100: '#ede9fe',
						200: '#ddd6fe',
						300: '#c4b5fd',
						400: '#a78bfa',
						500: '#8b5cf6',
						600: '#7c3aed',
						700: '#6d28d9',
						800: '#5b21b6',
						900: '#4c1d95',
					},
					teal: {
						DEFAULT: '#14b8a6',
						50: '#f0fdfa',
						100: '#ccfbf1',
						200: '#99f6e4',
						300: '#5eead4',
						400: '#2dd4bf',
						500: '#14b8a6',
						600: '#0d9488',
						700: '#0f766e',
						800: '#115e59',
						900: '#134e4a',
					},
					pink: {
						DEFAULT: '#ec4899',
						50: '#fdf2f8',
						100: '#fce7f3',
						200: '#fbcfe8',
						300: '#f9a8d4',
						400: '#f472b6',
						500: '#ec4899',
						600: '#db2777',
						700: '#be185d',
						800: '#9d174d',
						900: '#831843',
					},
					orange: {
						DEFAULT: '#f97316',
						50: '#fff7ed',
						100: '#ffedd5',
						200: '#fed7aa',
						300: '#fdba74',
						400: '#fb923c',
						500: '#f97316',
						600: '#ea580c',
						700: '#c2410c',
						800: '#9a3412',
						900: '#7c2d12',
					},
					cyan: {
						DEFAULT: '#06b6d4',
						50: '#ecfeff',
						100: '#cffafe',
						200: '#a5f3fc',
						300: '#67e8f9',
						400: '#22d3ee',
						500: '#06b6d4',
						600: '#0891b2',
						700: '#0e7490',
						800: '#155e75',
						900: '#164e63',
					},
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0',
					},
					to: {
						height: 'var(--radix-accordion-content-height)',
					},
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)',
					},
					to: {
						height: '0',
					},
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				slideIn: {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				slideInLeft: {
					'0%': { transform: 'translateX(-10px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-6px)' }
				},
				gradientShift: {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fadeIn 0.3s ease-out forwards',
				'slide-in': 'slideIn 0.3s ease-out forwards',
				'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
				'float': 'float 3s ease-in-out infinite',
				'gradient-shift': 'gradientShift 6s ease infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
