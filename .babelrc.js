const rollup = process.env.ROLLUP === '1';
const tests = process.env.TESTS === '1';

const modules = rollup ? false : 'commonjs';
const plugins = [];

if (rollup) {
  plugins.push('external-helpers');
}
if (tests) {
  plugins.push(
    'syntax-async-functions',
    ['transform-regenerator', { async: true }]
  );
}

module.exports = {
  presets: [
    ['es2015', {
      loose: true,
      modules,
    }],
    'react',
  ],
  plugins,
};
