// babel-css-transformer.js
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  // Configuration pour Babel, par exemple :
    presets: ['@babel/preset-env'],
});
