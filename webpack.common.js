const path = require('path');
const glob = require('glob');

module.exports = {
  entry: Object.fromEntries(
    glob.sync('./js/**/*.js').map(file => [
      path.parse(file).name,
      path.resolve(__dirname, file)
    ])
  ),
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/[name].js',
  },
};
