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
        "no-console": "error",
        "react-hooks/rules-of-hooks": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "unused-imports/no-unused-imports": "error",
        quotes: ["warn", "double", { avoidEscape: true }],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-var-requires": "off",
        "react/react-in-jsx-scope": "off",
        "import/no-named-as-default": "off",
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
        // {
        //     files: "./services/UI/client/**",
        //     rules: {
        //         "import/no-restricted-paths": [
        //             "error",
        //             {
        //                 zones: [
        //                     // disables cross-feature imports:
        //                     {
        //                         target: "./services/UI/client/src/features/auth",
        //                         from: "./services/UI/client/src/features",
        //                         except: ["./auth"],
        //                     },
        //                     // enforce unidirectional codebase:
        //                     {
        //                         target: "./services/UI/client/src/features",
        //                         from: "./services/UI/client/src/app",
        //                     },
        //                     {
        //                         target: [
        //                             "./services/UI/client/src/components",
        //                             "./services/UI/client/src/hooks",
        //                             "./services/UI/client/src/lib",
        //                             "./services/UI/client/src/types",
        //                             "./services/UI/client/src/utils",
        //                         ],
        //                         from: ["./services/UI/client/src/features", "./services/UI/client/src/app"],
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // },
    ],
    root: true,
};
