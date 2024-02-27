module.exports = {
    env: {
        es2020: true,
        browser: true,
        node: true,
        amd: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        "@typescript-eslint",
        "react",
        "react-hooks",
        "sonarjs",
        "unused-imports",
        "simple-import-sort",
        "prettier",
    ],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended",
        "plugin:import/warnings",
        "plugin:sonarjs/recommended",
        "prettier",
    ],
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "unused-imports/no-unused-imports": "error",
        quotes: ["warn", "double", { avoidEscape: true }],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
        "prettier/prettier": [
            "error",
            {
                printWidth: 120,
                useTabs: false,
                tabWidth: 4,
                trailingComma: "es5",
                singleQuote: false,
                semi: true,
                bracketSpacing: true,
                bracketSameLine: false,
                arrowParens: "always",
                endOfLine: "auto",
            },
        ],
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
            rules: {
                "simple-import-sort/imports": [
                    "error",
                    {
                        groups: [
                            ["^react", "^@?\\w"],
                            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
                            ["^.+\\.?(scss)$", "^.+\\.?(less)$", "^.+\\.?(css)$", "^\\u0000"],
                        ],
                    },
                ],
            },
        },
    ],
    root: true,
};
