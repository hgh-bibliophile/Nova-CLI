const execa = require('execa')
module.exports = (nova, options, signale, debug) => {
    nova.ext.img = (outDir) => {
        const dir = require('../../config.js')
        return new Promise(async (resolve, reject) => {
        try {
            await nova.ext.copy(dir.src.photos, outDir, '{jpg|png|jpeg}')
            await nova.ext.rename('photos')
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}





 