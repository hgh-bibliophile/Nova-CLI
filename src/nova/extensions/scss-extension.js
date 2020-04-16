const execa = require('execa')
const dir = require('../../config.js')
module.exports = (nova) => {
  nova.ext.scss = (outputDir, args) => {
    return new Promise(async (resolve, reject) => {
      const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? `--no-source-map`
        : `--source-map`
      try {
        await execa(
          `${dir.execa.sass}`,
          [`${srcmps}`, `${dir.src.styles}:${outputDir}`],
          dir.execa.config
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
          `${dir.execa.postcss} ${srcDir} ${srcmps} --use autoprefixer --dir ${outDir}`,
          dir.execa.config
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
          `${dir.execa.postcss} ${srcDir} --no-map --use cssnano --dir ${outDir}`,
          dir.execa.config
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
