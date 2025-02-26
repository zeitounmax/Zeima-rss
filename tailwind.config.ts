import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-background)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config;
