const execa = require('execa')
const fs = require('fs-extra')
module.exports = (nova, options, signale, debug) => {
    nova.ext.js = (outDir) => {
        const dir = require('../../config.js')
        const name = options.pro ? 'scripts.min': dir.name
        const srcmps = options.dev
        ? `--source-map`
        : options.pro
        ? ``
        : `--source-map`
        return new Promise(async (resolve, reject) => {
        try {
            await fs.mkdirp(outDir)
            await execa.command(`${dir.execa.terser} ${dir.src.js} ${srcmps} -o ${outDir}/${name}.js`,
                dir.execa.config
            )
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}
