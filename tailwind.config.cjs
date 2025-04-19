/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

module.exports = {
    mode: 'jit',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './safelist.txt'],
    darkMode: 'class',
    theme: {
        fontFamily: {
            sans: [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                '"Noto Sans"',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
                '"Noto Color Emoji"',
            ],
            serif: [
                'ui-serif',
                'Georgia',
                'Cambria',
                '"Times New Roman"',
                'Times',
                'serif',
            ],
            mono: [
                'ui-monospace',
                'SFMono-Regular',
                'Menlo',
                'Monaco',
                'Consolas',
                '"Liberation Mono"',
                '"Courier New"',
                'monospace',
            ],
        },
        screens: {
            xs: '576px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                primary: 'var(--primary)',
                'primary-deep': 'var(--primary-deep)',
                'primary-mild': 'var(--primary-mild)',
                'primary-subtle': 'var(--primary-subtle)',
                error: 'var(--error)',
                'error-subtle': 'var(--error-subtle)',
                success: 'var(--success)',
                'success-subtle': 'var(--success-subtle)',
                info: 'var(--info)',
                'info-subtle': 'var(--info-subtle)',
                warning: 'var(--warning)',
                'warning-subtle': 'var(--warning-subtle)',
                neutral: 'var(--neutral)',
                'gray-50': 'var(--gray-50)',
                'gray-100': 'var(--gray-100)',
                'gray-200': 'var(--gray-200)',
                'gray-300': 'var(--gray-300)',
                'gray-400': 'var(--gray-400)',
                'gray-500': 'var(--gray-500)',
                'gray-600': 'var(--gray-600)',
                'gray-700': 'var(--gray-700)',
                'gray-800': 'var(--gray-800)',
                'gray-900': 'var(--gray-900)',
                'gray-950': 'var(--gray-950)',
                // NetworkMonitor custom colors
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.gray.500'),
                        maxWidth: '65ch',
                    },
                },
                invert: {
                    css: {
                        color: theme('colors.gray.400'),
                    },
                },
            }),
            // NetworkMonitor custom animations
            animation: {
                ping: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                fadeIn: 'fadeIn 0.3s ease-in-out',
                slideUp: 'slideUp 0.3s ease-out',
            },
            keyframes: {
                ping: {
                    '0%': { transform: 'scale(1)', opacity: '0.8' },
                    '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/typography')],
}
