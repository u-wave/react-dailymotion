const rollup = process.env.ROLLUP === '1';
const tests = process.env.TESTS === '1';

const modules = rollup ? false : 'commonjs';
const plugins = [];

if (rollup) {
  plugins.push('external-helpers');
}

module.exports = {
  presets: [
    ['env', {
      loose: true,
      modules,
      targets: tests ? { node: 'current' } : {},
      forceAllTransforms: rollup,
    }],
    'react',
  ],
  plugins,
};
