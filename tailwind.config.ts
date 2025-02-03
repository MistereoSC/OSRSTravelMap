import type { Config } from "tailwindcss";

export default {
    content: [],
    theme: {
        extend: {
            colors: {
                "primary-50": "rgba(var(--primary-50))",
                "primary-100": "rgba(var(--primary-100))",
                "primary-200": "rgba(var(--primary-200))",
                "primary-300": "rgba(var(--primary-300))",

                "text-primary": "rgba(var(--text-primary))",
                "text-secondary": "rgba(var(--text-secondary))",
                "text-inverse": "rgba(var(--text-inverse))",
                "text-accent": "rgba(var(--text-accent))",

                "accent-sea": "var(--seacolor)",
                "accent-brown": "var(--a-brown)",
                "accent-yellow": "var(--a-yellow)",
                "accent-orange": "var(--a-orange)",
                "accent-green": "var(--a-green)",
                "accent-blue": "var(--a-blue)",
                "accent-cyan": "var(--a-cyan)",
                "accent-pink": "var(--a-pink)",
                "accent-purple": "var(--a-purple)",
                "accent-red": "var(--a-red)"
            }
        },
    },
    plugins: [],
} as Config;