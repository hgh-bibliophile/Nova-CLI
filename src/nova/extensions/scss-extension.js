const execa = require('execa')
const path = require('path')
const sass = path.join(__dirname, '../../../node_modules/sass/sass.js')
const postcss = path.join(__dirname, '../../../node_modules/postcss-cli/bin/postcss')
module.exports = (nova) => {
  nova.ext.scss = (outputDir, args) => {
    const dir = require('../../config/pathVar.js')
    var scsspromise = new Promise(async (resolve, reject) => {
      const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? `--no-source-map`
        : `--source-map`
      try {
        await execa.command(
          `${sass} ${srcmps} ${dir.src.styles}:${outputDir}`
        )
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
    return scsspromise
  },
  nova.ext.prefix = ([srcDir, outDir], args) => {
    var prefixpromise = new Promise(async (resolve, reject) => {
      const srcmps = args.dev ? `--map` : args.pro ? `--no-map` : `--map`
      try {
        await execa.command(
          `${postcss} ${srcDir} ${srcmps} --use autoprefixer --dir ${outDir}`
        )
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
    return prefixpromise
  },
  nova.ext.cssmin = ([srcDir, outDir], args) => {
    require('./rename-extension')(nova)
    var mincsspromise = new Promise(async (resolve, reject) => {
      if (args.pro) {
        try {
        await execa.command(
          `${postcss} ${srcDir} --no-map --use cssnano --dir ${outDir}`
        ).then(nova.ext.ext(outDir, 'css', 'min'))
        resolve(true)
      } catch (error) {
        reject(error)
      }
    }
    })
    return mincsspromise
  }
}
