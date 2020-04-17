const execa = require('execa')
const mkdirp = require('mkdirp')
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
    },
    nova.ext.imgcp = (outDir) => {
        const dir = require('../../config.js')                
        return new Promise(async(resolve, reject) => {
		await mkdirp(outDir)
		const ncp = require('ncp').ncp
		ncp(dir.src.photos, outDir, {clobber: false}, (err) => {
			if (err) return reject(err)
			return resolve(true)
		})
	})
    }
}





 
