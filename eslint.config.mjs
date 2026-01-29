import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // 🔻 Disable unused vars error
      "@typescript-eslint/no-unused-vars": "on",
      "@typescript-eslint/no-unused-expressions": "on",
      "@typescript-eslint/no-unused-labels": "on",
      "@typescript-eslint/no-unused-imports": "on",
      "@typescript-eslint/no-unused-parameters": "on",
      "@typescript-eslint/no-unused-properties": "on",
      "@typescript-eslint/no-unused-functions": "on",
      "@typescript-eslint/no-unused-classes": "on",
      "@typescript-eslint/no-unused-types": "on",
      "@typescript-eslint/no-unused-variables": "on",

      // 🔻 Disable React hooks exhaustive deps warning
      "react-hooks/exhaustive-deps": "on",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];

export default eslintConfig;
