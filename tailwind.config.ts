import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const customColors = {
  "pink-swan": {
    "50": "hsl(0, 14%, 97%)",
    "100": "hsl(0, 13%, 94%)",
    "200": "hsl(0, 11%, 89%)",
    "300": "hsl(0, 12%, 82%)",
    "400": "hsl(0, 11%, 71%)",
    "500": "hsl(0, 10%, 60%)",
    "600": "hsl(0, 9%, 51%)",
    "700": "hsl(0, 9%, 42%)",
    "800": "hsl(0, 9%, 35%)",
    "900": "hsl(0, 8%, 31%)",
    "950": "hsl(0, 9%, 15%)",
  },
  sandstone: {
    50: "hsl(30, 8%, 95%)",
    100: "hsl(24, 8%, 88%)",
    200: "hsl(30, 7%, 77%)",
    300: "hsl(28, 8%, 64%)",
    400: "hsl(28, 7%, 53%)",
    500: "hsl(22, 7%, 45%)",
    600: "hsl(21, 7%, 40%)",
    700: "hsl(10, 7%, 33%)",
    800: "hsl(7, 5%, 29%)",
    900: "hsl(0, 5%, 26%)",
    950: "hsl(0, 6%, 14%)",
  },
  zorba: {
    "50": "hsl(30, 14%, 97%)",
    "100": "hsl(30, 7%, 94%)",
    "200": "hsl(30, 7%, 89%)",
    "300": "hsl(34, 8%, 82%)",
    "400": "hsl(27, 7%, 71%)",
    "500": "hsl(30, 7%, 61%)",
    "600": "hsl(30, 6%, 51%)",
    "700": "hsl(32, 6%, 42%)",
    "800": "hsl(30, 6%, 35%)",
    "900": "hsl(30, 5%, 31%)",
    "950": "hsl(36, 6%, 15%)",
  },
  woodsmoke: {
    "50": "hsl(240, 7%, 97%)",
    "100": "hsl(270, 12%, 94%)",
    "200": "hsl(266, 10%, 86%)",
    "300": "hsl(268, 11%, 74%)",
    "400": "hsl(265, 11%, 60%)",
    "500": "hsl(266, 10%, 48%)",
    "600": "hsl(266, 11%, 39%)",
    "700": "hsl(267, 11%, 32%)",
    "800": "hsl(266, 10%, 27%)",
    "900": "hsl(265, 10%, 24%)",
    "950": "hsl(270, 10%, 8%)",
  },
  pinkier: {
    "50": "#fff1f4",
    "100": "#ffe4e9",
    "200": "#fdced9",
    "300": "#fcb5c6",
    "400": "#f87496",
    "500": "#f14274",
    "600": "#dd2160",
    "700": "#bb1551",
    "800": "#9c154a",
    "900": "#861545",
    "950": "#4b0622",
    DEFAULT: "#fcb5c6",
    dark: "#f87496",
  },
  cream: {
    "50": "#fefde8",
  },
} as const;

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        dark: {
          DEFAULT: customColors.cream["50"],
          background: {
            DEFAULT: customColors.woodsmoke["900"],
            dimmed: customColors.woodsmoke["950"],
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
