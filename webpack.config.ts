import path from 'path'

module.exports = {
  mode: 'production',
  entry: './index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    "bufferutil": "commonjs bufferutil",
    "utf-8-validate": "commonjs utf-8-validate",
  },
}
