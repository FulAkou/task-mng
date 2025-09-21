// eslint.config.js
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  {
    ignores: ["dist", "node_modules", "build"], // fichiers/dossiers à ignorer
  },

  {
    files: ["**/*.{ts,tsx,js,jsx}"], // extensions gérées
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin,
    },
    rules: {
      // Recommandations de base
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,

      // Hooks rules
      ...reactHooks.configs.recommended.rules,

      // Prettier doit passer en dernier pour override
      "prettier/prettier": "error",

      // Ajustements utiles
      "react/react-in-jsx-scope": "off", // inutile avec React 17+
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
// import js from "@eslint/js";
// import tsPlugin from "@typescript-eslint/eslint-plugin";
// import tsParser from "@typescript-eslint/parser";
// import prettierPlugin from "eslint-plugin-prettier";
// import globals from "globals";

// export default [
//   {
//     ignores: ["dist"],
//   },
//   {
//     files: ["**/*.{ts,tsx,js}"],
//     languageOptions: {
//       parser: tsParser,
//       ecmaVersion: "latest",
//       sourceType: "module",
//       globals: {
//         ...globals.node,
//       },
//     },
//     plugins: {
//       "@typescript-eslint": tsPlugin,
//       prettier: prettierPlugin,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...tsPlugin.configs.recommended.rules,
//       "prettier/prettier": "error",
//     },
//   },
// ];
