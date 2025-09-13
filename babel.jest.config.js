const isTurbopack = process.env.TURBOPACK === 'true'

module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],

  ...(isTurbopack ? { babelrc: false } : {}),
}
