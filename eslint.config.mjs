import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "scripts/**",
      "_unused/**",
      "archive/**",
      "about_us/**",
      "design_claude/**",
      "design_claude_homepage/**",
      "design_logo/**",
      "audit-shots/**",
      ".next/**",
      ".next-dev/**",
      ".next-verify/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
