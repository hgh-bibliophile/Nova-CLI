const project = require('../../package.json')
module.exports = {
  src: {
    root: './files/src',
    styles: './files/src/styles',
    scripts: './files/src/scripts',
    photos: './files/src/photos',
    html: './files/src/*.html',
    scss: './files/src/styles/*.scss',
    css: './files/src/styles/*.css',
    js: './files/src/scripts/*.js',
    img:
      './files/src/photos/*.jpg ./files/src/photos/*.png ./files/src/photos/*.ico'
  },
  tmp: {
    root: './files/tmp',
    styles: './files/tmp/styles',
    scripts: './files/tmp/scripts',
    photos: './files/tmp/photos',
    html: './files/tmp/*.html',
    scss: './files/tmp/styles/*.scss',
    css: './files/tmp/styles/*.css',
    js: './files/tmp/scripts/*.js',
    img:
      './files/tmp/photos/*.jpg ./files/tmp/photos/*.png ./files/tmp/photos/*.ico'
  },
  dist: {
    root: './files/dist',
    styles: './files/dist',
    scripts: './files/dist',
    photos: './files/dist/photos',
    html: './files/dist/*.html',
    scss: './files/dist/*.scss',
    css: './files/dist/*.css',
    js: './files/dist/*.js',
    img:
      './files/dist/photos/*.jpg ./files/dist/photos/*.png ./files/dist/photos/*.ico'
  },
  conf: './src/config/nova.config',
  name: project.name
}
