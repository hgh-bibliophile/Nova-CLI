const execa = require('execa')
const imagemin = 'imagemin'
module.exports = (nova) => {
    nova.ext.imgmin = (outDir) => {
        const dir = require('../../config.js')
                
        return new Promise(async (resolve, reject) => {
        try {
            await execa.command(`${imagemin} ${dir.src.photos} -o=${outDir}`,
                dir.execa
            )
            return resolve(true)
        } catch (error) {
            return reject(error)
        }
      })
    }
}





 
