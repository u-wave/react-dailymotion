module.exports = (babel, options) => {
  const rollup = options && options.rollup;
  const tests = options && options.tests;

  const modules = rollup ? false : 'commonjs';
  const plugins = [
    'transform-class-properties',
    ['transform-react-remove-prop-types', { mode: 'wrap' }],
  ];

  if (rollup) {
    plugins.push('external-helpers');
  }
  if (tests) {
    plugins.push('syntax-async-functions');
    plugins.push(['transform-regenerator', { async: true }]);
  }

  return {
    presets: [
      ['es2015', {
        loose: true,
        modules,
      }],
      'react',
    ],
    plugins,
  };
};
