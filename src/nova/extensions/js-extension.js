const terser = `terser`
const execa = require('execa')
const mkdirp = require('mkdirp')
module.exports = (nova) => {
    nova.ext.js = (outDir, args) => {
        const dir = require('../../config.js')
        const name = args.pro ? 'scripts.min': dir.name
        const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? ``
        : `--source-map`
        return new Promise(async (resolve, reject) => {
        try {
            await mkdirp(outDir)
            await execa.command(`${terser} ${dir.src.js} ${srcmps} -o ${outDir}/${name}.js`,
                dir.execa
            )
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}
