const Listr = require('listr')
let img = {}
module.exports = async (nova, options, signale, debug) => {
	img.setup = async () => {
		require('./extensions.js')(nova, options, signale, debug)
		img.opt = require('../config.js')
		img.dir = await nova.ext.dest('photos')
		img.src = img.opt.src.photos
	},
	img.tasks = new Listr([
		{
			title: `Optimize images`,
			enabled: () => !img.opt.exe,
			task: () => nova.ext.imgmin(img.dir)
		},
		{
			title: `Copy images`,
			enabled: () => img.opt.exe,
			task: () => nova.ext.copy(img. src, img.dir)
		}
	]),
	nova.listr.img = async () => {
		await img.setup()
		return img.tasks
	},
	nova.ext.imgAll = async () => {
		await img.setup()
		return new Promise(async (resolve,reject) => {
			try {
				await img.tasks.run()
				signale.success(`Image Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: Image Optimizing Didn't Finish")
				return reject(err)
			}
		})
		
	}
  }
  
  