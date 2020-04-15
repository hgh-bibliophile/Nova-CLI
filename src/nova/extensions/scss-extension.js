const sass = 'sass'
const postcss = 'postcss'
const execa = require('execa')
module.exports = (nova) => {
  nova.ext.scss = (outputDir, args) => {
    const dir = require('../../config.js')
    return new Promise(async (resolve, reject) => {
      const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? `--no-source-map`
        : `--source-map`
      try {
        await execa(
          `${sass}`,
          [`${srcmps}`, `${dir.src.styles}:${outputDir}`],
          dir.execa
        )
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  },
  nova.ext.prefix = ([srcDir, outDir], args) => {
   return new Promise(async (resolve, reject) => {
      const srcmps = args.dev ? `--map` : args.pro ? `--no-map` : `--map`
      try {
        await execa.command(
          `${postcss} ${srcDir} ${srcmps} --use autoprefixer --dir ${outDir}`,
          dir.execa
        )
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    })
  },
  nova.ext.cssmin = ([srcDir, outDir], args) => {
    return new Promise(async (resolve, reject) => {
      if (args.pro) {
        try {
        await execa.command(
          `${postcss} ${srcDir} --no-map --use cssnano --dir ${outDir}`,
          dir.execa
        )
	      await nova.ext.file(outDir, 'css', 'min')
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    }
    })
  }
}
