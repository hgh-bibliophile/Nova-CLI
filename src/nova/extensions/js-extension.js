const path = require("path")
const uglifyjs = path.join(__dirname, "../../../node_modules/uglify-js/bin/uglifyjs")
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
            await execa.command(`${uglifyjs} ${dir.src.js} ${srcmps} -o ${outDir}/${name}.js`)
            resolve(true)
        } catch (error) {
            reject(error)
        }
      })
      return jspromise
    }
}
