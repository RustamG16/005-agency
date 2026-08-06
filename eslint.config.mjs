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
      // Design-board material (the render harness that produced DESIGN-LOCK.md,
      // plus the Stitch export tree). Nothing under app/ or components/ imports
      // from it — the app only cites it in comments — but it was failing the
      // build's lint pass on 1048 errors that predate any of this work.
      "homepage/**",
      "audit-shots/**",
      ".next/**",
      ".next-dev/**",
      ".next-verify/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
