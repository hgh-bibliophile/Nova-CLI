const uglifyjs = `uglifyjs`
const execa = require('execa')
const mkdirp = require('mkdirp')
module.exports = (nova) => {
    nova.ext.js = (outDir, args) => {
        const dir = require('../../config/pathVar.js')
        const name = args.pro ? 'scripts.min': dir.name
        const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? ``
        : `--source-map`
        var jspromise = new Promise(async (resolve, reject) => {
        try {
            await mkdirp(outDir)
            await execa.command(`${uglifyjs} ${dir.src.js} ${srcmps} -o ${outDir}/${name}.js`,
                { preferLocal: true }
            )
            resolve(true)
        } catch (error) {
            reject(error)
        }
      })
      return jspromise
    }
}
