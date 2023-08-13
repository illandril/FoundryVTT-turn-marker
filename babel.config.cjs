// eslint-disable-next-line no-undef
module.exports = (api) => ({
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: [
          '>0.5% and supports es6-module and not dead',
          'not and_uc > 0',
          'not safari < 15',
          'not iOS < 15',
          'firefox esr',
        ],
      },
    }],
    ['@babel/preset-typescript'],
    ...api.env('test')
      ? []
      : [['minify', {
        builtIns: false,
        mangle: true,
      }]],
  ],
  comments: false,
});
