const rollup = process.env.ROLLUP === '1';
const tests = process.env.TESTS === '1';

const modules = rollup ? false : 'commonjs';

module.exports = {
  presets: [
    ['@babel/env', {
      loose: true,
      modules,
      targets: tests ? { node: 'current' } : {},
      forceAllTransforms: rollup,
    }],
    '@babel/react',
  ],
};
