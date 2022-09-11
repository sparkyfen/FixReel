const path = require('path');
const webpack = require('webpack');

const gitCommit = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString()
  .trim();
const gitBranch = require('child_process')
  .execSync('git rev-parse --abbrev-ref HEAD')
  .toString()
  .trim();

const releaseName = `fixreel-${gitBranch}-${gitCommit}-${new Date()
  .toISOString()
  .substring(0, 19)}`;

require('dotenv').config();

let envVariables = [
  'BRANDING_NAME',
  'BRANDING_NAME_DISCORD',
  'DIRECT_MEDIA_DOMAINS',
  'HOST_URL',
  'REDIRECT_URL',
  'EMBED_URL',
  'MOSAIC_DOMAIN_LIST',
  'API_HOST_LIST'
];

let plugins = [
  ...envVariables.map(envVar => {
    return new webpack.DefinePlugin({
      [envVar]: JSON.stringify(process.env[envVar])
    });
  }),
  new webpack.DefinePlugin({
    RELEASE_NAME: `'${releaseName}'`
  })
];
module.exports = {
  entry: { worker: './src/index.ts' },
  target: 'webworker',
  devtool: 'source-map',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'production',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    fallback: { util: false }
  },
  plugins: plugins,
  optimization: { mangleExports: false },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: { transpileOnly: true }
      }
    ]
  }
};