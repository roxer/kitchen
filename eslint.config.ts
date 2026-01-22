import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintPluginBetterTailwindcss from "eslint-plugin-better-tailwindcss";
export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
  {
    plugins: {
      "better-tailwindcss": eslintPluginBetterTailwindcss,
    },
    rules: {
      "vue/block-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],
      // enable all recommended rules to report a warning
      ...eslintPluginBetterTailwindcss!.configs["recommended-warn"]!.rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss!.configs["recommended-error"]!.rules,

      // or configure rules individually
      "better-tailwindcss/enforce-consistent-line-wrapping": ["off"],
      "better-tailwindcss/no-unregistered-classes": ["off"],
    },
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/frontend/styles/main.css",
      },
    },
  },
]);
