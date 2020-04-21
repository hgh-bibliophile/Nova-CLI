const execa = require('execa')
module.exports = (nova) => {
    nova.ext.imgmin = (outDir) => {
        const dir = require('../../config.js')
        return new Promise(async (resolve, reject) => {
        try {
            await execa.command(`${dir.execa.imagemin} ${dir.src.photos} -o=${outDir}`,
                dir.execa.config
            )
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}





 
