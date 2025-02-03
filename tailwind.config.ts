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

                "accent-sea": "var(--seacolor)"
            }
        },
    },
    plugins: [],
} as Config;