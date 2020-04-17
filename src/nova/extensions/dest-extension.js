module.exports = (nova, options) => {
	nova.ext.dest = outputDir => {
		return new Promise((resolve,reject) => {
			const dir = require('../../config.js')
			let findPath
			if (options.dev) {
				return resolve(dir.tmp[outputDir])
			} else if (options.pro) {
				return resolve(dir.dist[outputDir])
			} else {
				return resolve(dir.tmp[outputDir])
			} 
		})
	}
}
