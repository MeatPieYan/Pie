module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "rules": {
    "comma-dangle": ["error", "never"],
    "consistent-return": ["off"],
    "function-paren-newline": ["off"],
    "import/no-dynamic-require": ["off"],
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/*.test.js", "**/*.dev.**.js", "**/*.dev.js", "**/webpack.**.js"]}],
    "jsx-quotes": ["error", "prefer-single"],
    "max-len": ["error", { "code": 200 }],
    "no-console": ["error", { allow: ["log", "warn", "error"] }],
    "no-param-reassign": ["off"],
    "no-underscore-dangle": ["off"],
    "react/forbid-prop-types": ["off"],
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }]
  }
};
