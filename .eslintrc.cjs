module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    extends: [
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript',
        'plugin:prettier/recommended',
    ],
    rules: {
        // Add your custom rules here
        'vue/multi-word-component-names': 'off',
    },
}
