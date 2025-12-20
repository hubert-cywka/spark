module.exports = {
    env: {
        es2020: true,
        browser: true,
        node: true,
        amd: true,
    },
    ignorePatterns: ["node_modules/", "dist/", "coverage/", "build/", "services/Backend/documentation/"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ["local-rules", "@typescript-eslint", "react", "react-hooks", "sonarjs", "unused-imports", "simple-import-sort", "prettier"],
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
        "local-rules/no-dto-as-type": "error",
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
        "sonarjs/no-duplicate-string": "off",
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
