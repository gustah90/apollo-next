const isTurbopack = process.env.TURBOPACK === 'true'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
        modules: 'commonjs',
      },
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        importSource: 'react',
      },
    ],
  ],

  ...(isTurbopack ? { babelrc: false } : {}),
}
