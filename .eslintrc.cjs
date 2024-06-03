// stolen from blacket frontend repo (https://github.com/BlacketPS/frontend/)
module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended"
    ],
    ignorePatterns: ["dist", "*.cjs", "src/types/**"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint/eslint-plugin", "@stylistic"],
    rules: {
        // TypeScript Rules
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": "error",

        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "off",

        // Blacket Rules
        "max-depth": ["error", 5],
        "prefer-spread": "off",
        "no-delete-var": "off",
        "@stylistic/quotes": ["error", "double"],
        "@stylistic/arrow-parens": ["error", "always"],
        "@stylistic/arrow-spacing": "error",
        "@stylistic/block-spacing": "error",
        "@stylistic/brace-style": "error",
        "@stylistic/comma-dangle": ["error", "never"],
        "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],
        "@stylistic/dot-location": ["error", "property"],
        "@stylistic/type-annotation-spacing": "error",
        "@stylistic/spaced-comment": ["warn", "always"],
        "@stylistic/semi": ["error", "always"]
    }
};