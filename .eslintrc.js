module.exports = {
    "parser": '@typescript-eslint/parser',
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": ["plugin:@typescript-eslint/recommended"],
    "plugins": [
        "@typescript-eslint",
    ],
    "parserOptions": {
        "ecmaVersion": 2016,  // Allows for the parsing of modern ECMAScript features
        "sourceType": 'module',  // Allows for the use of imports
        "project": "./tsconfig.json",
    },
    "rules": {
        "@typescript-eslint/rule-name": "error",
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-debugger": "off"
    }
};
