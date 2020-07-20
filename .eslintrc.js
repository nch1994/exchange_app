'use strict';

module.exports = {
    root: true,
    extends: [
        'plugin:vue/recommended'
    ],
    rules: {
        'indent': [2, 2],
        'linebreak-style': [0, 'error', 'windows'],
        "vue/singleline-html-element-content-newline": "off",
        "vue/multiline-html-element-content-newline": "off",
        "vue/require-prop-types": "off",
        "vue/max-attributes-per-line": "off",
        "vue/attributes-order": "off",
        "vue/mustache-interpolation-spacing": "off",
        "vue/attribute-hyphenation": "off",
        "no-unused-vars": 2,
        "no-const-assign": 2,
        "no-use-before-define": 1
    },
    plugins: [
        'html',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        'sourceType': 'module',
    },
    
};
