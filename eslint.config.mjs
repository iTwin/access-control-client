import iTwinPlugin from "@itwin/eslint-plugin";

export default [
  {
    files: ["src/**/*.{ts,tsx}"],
    ...iTwinPlugin.configs.iTwinjsRecommendedConfig,
  },
  // Only apply JSDoc rules to non-test files
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "src/test/**/*"],
    ...iTwinPlugin.configs.jsdocConfig,
    rules: {
      "jsdoc/require-jsdoc": ["error", {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      }],
    },
  },
  // Shipped ESM is loaded by Node, which requires file extensions on relative imports (#81)
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "src/test/**/*"],
    rules: {
      "no-restricted-imports": ["error", {
        patterns: [{
          regex: "^\\.{1,2}/(?!.*\\.js$)",
          message: "Relative imports must end in .js so the ESM build loads in Node.js.",
        }],
      }],
    },
  },
  // Rules for all source files
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-duplicate-imports": "off", // Allow separate type/value imports
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "src/test/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "id-denylist": "off",
    },
  },
  {
    ignores: ["node_modules/**", "lib/**"],
  },
];