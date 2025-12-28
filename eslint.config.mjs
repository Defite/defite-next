import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  // Base JavaScript config
  js.configs.recommended,
  
  // TypeScript config
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
  
  // Next.js config
  nextCoreWebVitals,
  
  // Prettier config (must be last)
  prettierConfig,
  
  // Global rules
  {
    rules: {
      "no-console": "error",
    },
  },
]);