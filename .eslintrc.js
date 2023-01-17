module.exports = {
    env: {
        browser: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'airbnb-base',
        'airbnb-typescript/base',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint', 'prettier', 'html'],
    root: true,
    rules: {
        'linebreak-style': 'off',
        'class-methods-use-this': 'off',
        'no-plusplus': 'off',
        'no-param-reassign': 'off',
        'no-new': 'off',
        'no-return-assign': 'off',
        '@typescript-eslint/no-explicit-any': 2,
        'import/prefer-default-export': 0,
        'lines-between-class-members': 'off',
        '@typescript-eslint/lines-between-class-members': 'false',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', 'src/'],
            },
        },
    },
};
