const sass = 'sass'
const postcss = 'postcss'
const execa = require('execa')
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
        await execa(
          `${sass}`,
          [`${srcmps}`, `${dir.src.styles}:${outputDir}`],
          { preferLocal: true }
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
        await execa(
          `${postcss}`,
          [`${srcDir}`,`${srcmps} --use autoprefixer -d ${outDir}`],
          { preferLocal: true }
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
        await execa(
          `${postcss}`,
          [`${srcDir}`,`--no-map --use cssnano -d ${outDir}`],
          { preferLocal: true }
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
