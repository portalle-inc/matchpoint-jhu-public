/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  extends: ["custom/next"],
  rules: {
    "import/no-extraneous-dependencies": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/*": "off",
    "turbo/no-undeclared-env-vars": "off",
    // "import/no-unresolved": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "no-implicit-coercion": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "no-alert": "off",
    "no-console": "warn",
    "no-nested-ternary": "off",
    "eslint-comments/require-description": "off",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
  },
  settings: {},
};
