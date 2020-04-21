const execa = require('execa')
const fs = require('fs-extra')
module.exports = (nova, options, signale, debug)=> {
    nova.ext.html = (outDir) => {
        const dir = require('../../config.js')
        return new Promise(async (resolve, reject) => {
        try {
            await fs.mkdirp(outDir)
            await execa.command(`${dir.execa.htmlclean} -i ${dir.src.html} -o ${outDir}`,
                dir.execa.config
            )
            await nova.ext.replace()
            await nova.ext.file(outDir, 'html', false)
	    await nova.ext.file(outDir, 'all', false)
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}
