const htmlclean = `htmlclean`
const execa = require('execa')
const mkdirp = require('mkdirp')
module.exports = (nova) => {
    nova.ext.html = (outDir, args) => {
        const dir = require('../../config.js')
        return new Promise(async (resolve, reject) => {
        try {
            await mkdirp(outDir)
            await execa.command(`${htmlclean} -i ${dir.src.html} -o ${outDir}`,
                dir.execa.config
            )
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}
