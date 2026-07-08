import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          container: "var(--surface-container)",
          "container-low": "var(--surface-container-low)",
          "container-high": "var(--surface-container-high)",
          "container-highest": "var(--surface-container-highest)",
        },
        accent: {
          DEFAULT: "#C3F400",
          dim: "#ABD600",
          glow: "rgba(195, 244, 0, 0.15)",
          dark: "#3C4D00",
        },
        muted: {
          DEFAULT: "#888888",
          foreground: "#C4C9AC",
        },
        card: {
          DEFAULT: "var(--surface)",
          foreground: "var(--foreground)",
        },
        border: "var(--border)",
        ring: "#C3F400",
        success: "#4ADE80",
        warning: "#FACC15",
        danger: "#F87171",
        info: "#60A5FA",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display-stat": ["48px", { lineHeight: "48px", letterSpacing: "-0.04em", fontWeight: "800" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }],
        "stat-label": ["14px", { lineHeight: "20px", fontWeight: "500" }],
      },
      borderRadius: {
        card: "16px",
        lg: "12px",
        md: "8px",
      },
      spacing: {
        "safe-bottom": "84px",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
