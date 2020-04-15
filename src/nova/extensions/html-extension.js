const htmlclean = `htmlclean`
const execa = require('execa')
const mkdirp = require('mkdirp')
module.exports = (nova) => {
    nova.ext.html = (outDir, args) => {
        const dir = require('../../config/pathVar.js')
        var htmlpromise = new Promise(async (resolve, reject) => {
        try {
            await mkdirp(outDir)
            await execa.command(`${htmlclean} -i ${dir.src.html} -o ${outDir}`,
                { preferLocal: true }
            )
            resolve(true)
        } catch (error) {
            reject(error)
        }
      })
      return htmlpromise
    }
}
