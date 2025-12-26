/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020617",
                foreground: "#f8fafc",
                card: "#0f172a",
                primary: {
                    DEFAULT: "#38bdf8",
                    foreground: "#0c4a6e",
                },
                accent: {
                    DEFAULT: "#818cf8",
                    foreground: "#1e1b4b",
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
