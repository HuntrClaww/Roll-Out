const path = require('path');

module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
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
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8080,
    // 0.0.0.0 (not the previous default of localhost) so the dev server
    // is reachable from Replit's webview/proxy and other container
    // environments, not just the machine running webpack itself.
    host: '0.0.0.0',
    // Auto-opening a system browser has no effect in a headless
    // container (Replit, CI, etc.) - previously 'true', which was
    // silently a no-op there.
    open: false,
    hot: true,
    // Replit's proxy connects through a wildcard subdomain, not
    // localhost, so the dev server must accept requests for any host
    // rather than only the ones webpack-dev-server would otherwise
    // allow by default.
    allowedHosts: 'all',
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
