const execa = require('execa')
const fs = require('fs-extra')
module.exports = (nova, options, signale, debug) => {
    nova.ext.js = async (outDir) => {
        const dir = require('../../config.js')
        const name = await nova.ext.base(dir.src.js, outDir)
        const srcmps = options.dev
        ? `--source-map`
        : options.pro
        ? ``
        : `--source-map`
        return new Promise(async (resolve, reject) => {
        try {
            await fs.mkdirp(outDir)
            await execa.command(`${dir.execa.terser} ${dir.src.js} ${srcmps} -o ${name}`,
                dir.execa.config
            )
            await nova.ext.refresh('js')
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}
