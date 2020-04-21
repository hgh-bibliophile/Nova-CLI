const project = require('../package.json')
const path = require('path')
/*node*/
const bin = path.join(__dirname, '../node_modules/.bin')
const sass = `sass`
const postcss = `postcss`
const terser = `terser`
const imagemin = `imagemin`
const prettier = `prettier`
const htmlclean = `htmlclean`
const config = {preferLocal: true, localDir: bin }
const exe = false
/*pkg
const bin = ''
const imagemin = ``
const sass = path.join(__dirname, '../node_modules/sass/sass.js')
const postcss = path.join(__dirname, '../node_modules/postcss-cli/bin/postcss')
const terser = path.join(__dirname, '../node_modules/terser/bin/terser')
const prettier = path.join(__dirname, "../node_modules/prettier/bin-prettier.js")
const htmlclean = path.join(__dirname, "../node_modules/htmlclean-cli/htmlclean-cli.js")
const config = {}
const exe = true*/
const dDir = {
  dir: {
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
        './files/src/photos/*.{jpg,png,ico}'
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
        './files/tmp/photos/*.{jpg,png,ico}'
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
        './files/dist/photos/*.{jpg,png,ico}'
    }
  }
}
const novaCfg = require('rc')(project.name, dDir)
module.exports = {
  config: novaCfg,
  src: novaCfg.dir.src,
  tmp: novaCfg.dir.tmp,
  dist: novaCfg.dir.dist,
  version: project.version,
  description: project.description,
  name: project.name,
  exe: exe,
  execa: {
	  config: config,
	  bin: bin,
	  sass: sass,
	  postcss: postcss,
	  terser: terser,
	  htmlclean: htmlclean,
	  prettier: prettier,
	  imagemin: imagemin
  }
}
