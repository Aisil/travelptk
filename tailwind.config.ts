import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-primary-fixed": "#002021",
        "secondary-container": "#454747",
        "on-secondary-fixed": "#1a1c1c",
        "background": "#12131a",
        "on-secondary": "#2f3131",
        "primary-container": "#00f5ff",
        "on-background": "#e3e1ec",
        "secondary": "#c6c6c7",
        "outline-variant": "#3a494a",
        "on-tertiary-container": "#616064",
        "on-tertiary-fixed": "#1b1b1e",
        "outline": "#849495",
        "tertiary-fixed-dim": "#c8c5ca",
        "on-primary-fixed-variant": "#004f53",
        "surface-dim": "#12131a",
        "surface-container-low": "#1a1b22",
        "error": "#ffb4ab",
        "on-secondary-container": "#b4b5b5",
        "surface-container": "#1e1f26",
        "primary-fixed-dim": "#00dce5",
        "inverse-surface": "#e3e1ec",
        "surface-bright": "#383941",
        "on-error": "#690005",
        "tertiary": "#fcf8fd",
        "on-error-container": "#ffdad6",
        "on-surface-variant": "#b9caca",
        "inverse-on-surface": "#2f3038",
        "on-primary-container": "#006c71",
        "tertiary-fixed": "#e4e1e6",
        "on-primary": "#003739",
        "surface": "#12131a",
        "on-secondary-fixed-variant": "#454747",
        "surface-container-highest": "#33343c",
        "secondary-fixed": "#e2e2e2",
        "surface-tint": "#00dce5",
        "primary": "#e9feff",
        "on-surface": "#e3e1ec",
        "on-tertiary-fixed-variant": "#47464a",
        "surface-container-lowest": "#0d0e15",
        "on-tertiary": "#303033",
        "inverse-primary": "#00696e",
        "secondary-fixed-dim": "#c6c6c7",
        "primary-fixed": "#63f7ff",
        "surface-variant": "#33343c",
        "tertiary-container": "#dfdce0",
        "error-container": "#93000a",
        "surface-container-high": "#292931"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "element-gap": "32px",
        "container-max": "1280px",
        "stack-md": "16px",
        "section-padding-y": "120px",
        "gutter": "24px",
        "stack-sm": "8px"
      },
      fontFamily: {
        "body-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "display-xl": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "label-caps": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-lg-mobile": ["Space Grotesk", "sans-serif"]
      },
      fontSize: {
        "body-md": ["16px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" }],
        "display-xl": ["80px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "1.4", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-caps": ["12px", { lineHeight: "1.0", letterSpacing: "0.15em", fontWeight: "600" }],
        "headline-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }]
      }
    },
  },
  plugins: [],
};

export default config;
