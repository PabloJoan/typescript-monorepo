import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import reactCompiler from "eslint-plugin-react-compiler";
import jsxA11y from "eslint-plugin-jsx-a11y";
import query from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/dist",
      "**/node_modules",
      "**/.drizzle",
      "**/.vinxi",
      "apps/client/src/routeTree.gen.ts",
    ],
  },

  // Base JS/TS Configs
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,

  // Custom Base Overrides
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-definitions": ["warn", "type"],
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  },

  // React Specific Configs (scoped to apps/client)
  ...[
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    jsxA11y.flatConfigs.recommended,
    query.configs["flat/recommended"],
    reactCompiler.configs.recommended,
  ]
    .flat()
    .map((config) => ({
      ...config,
      files: ["apps/client/**/*.{ts,tsx}"],
    })),

  // Client Custom Overrides
  {
    files: ["apps/client/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-compiler": reactCompiler,
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
    rules: {
      "react/prop-types": "off",
      "react-compiler/react-compiler": "error",
    },
  },

  // Server Custom Overrides
  {
    files: ["apps/server/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "no-console": "warn",
    },
  },

  // Prettier (must be last)
  prettier,
];
