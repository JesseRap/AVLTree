const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

const sveltePath = path.resolve(__dirname, 'node_modules', 'svelte')

module.exports = {
  entry: {
    bundle: ['@babel/polyfill', './src/main.js'],
  },
  resolve: {
    alias: {
      svelte: sveltePath,
    },
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/public',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      // Rules are chained bottom to top. Babel rule must probably be one of
      // the last of the chain, so it must come first in the array.
      {
        test: /\.(?:svelte|m?js)$/,
        // Svelte internals, under node_modules MUST be included.
        //
        // Babel 7 ignores node_modules automatically, but not if they're
        // explicitely included.
        // see: https://github.com/babel/babel-loader/issues/171#issuecomment-486380160
        //
        include: [path.resolve(__dirname, 'src'), sveltePath],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'ie >= 9',
                },
              ],
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-optional-chaining",
            ]
          },
        },
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          'style-loader',
          'css-loader'
        ],
      },
    ],
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
  devtool: prod ? false : 'source-map',
}
