module.exports = {
  presets: [
    ['@babel/preset-env', {targets: {node: 'current'}}],
    '@babel/preset-typescript'
  ],
  plugins: [
    // your existing plugins
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
};