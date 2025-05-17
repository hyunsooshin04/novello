module.exports = {
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        requireConfigFile: false,
        babelOptions: {
            parserOpts: {
                plugins: ['importAssertions'],
            },
        },
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    root: true,
    env: {
        es2022: true,
        node: true,
    },
    ignorePatterns: ['.eslintrc.cjs', 'node_modules', 'dist'],
    rules: {
        'no-console': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'always',
                mjs: 'always',
                jsx: 'always',
            },
        ],
        camelcase: ['off'],
    },
};
