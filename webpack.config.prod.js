const path = require('node:path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const fs = require('node:fs');
const SitemapPlugin = require('sitemap-webpack-plugin').default;

const sitemapPaths = fs.readdirSync(__dirname)
  .filter((file) => path.extname(file) === '.html' && file !== '404.html')
  .map((file) => {
    const stats = fs.statSync(path.join(__dirname, file));
    return {
      path: file === 'index.html' ? '/' : `/${path.basename(file, '.html')}`,
      lastmod: stats.mtime.toISOString().split('T')[0],
    };
  });

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    ...glob.sync('./*.html', { ignore: ['./404.html'] }).map((file) =>
      new HtmlWebpackPlugin({
        template: file,
        filename: path.basename(file),
      })
    ),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
    new SitemapPlugin({ base: 'https://example.com', paths: sitemapPaths }),
  ],
});
