module.exports = {
    env: {
        es2020: true,
        browser: true,
        node: true,
        amd: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'react-hooks',
        'sonarjs',
        'unused-imports',
        'simple-import-sort'
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:import/warnings',
        'plugin:sonarjs/recommended',
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'unused-imports/no-unused-imports': 'error',
        'import/newline-after-import': ['error', { 'count': 2 }],
        'quotes': ['warn', 'single', { 'avoidEscape': true }],
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off'
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    overrides: [
        {
            files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
            rules: {
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            ['^react', '^@?\\w'],
                            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                            ['^.+\\.?(scss)$', '^.+\\.?(less)$', '^.+\\.?(css)$', '^\\u0000']
                        ]
                    }
                ]
            }
        }
    ]
};
