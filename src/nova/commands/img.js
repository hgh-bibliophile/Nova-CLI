const Listr = require('listr')
let img = {}
module.exports = async (nova, options, signale, debug) => {
	img.setup = async () => {
		require('../utils.js')(nova, options, signale, debug)
		img.dir = await nova.ext.dest('photos')
	},
	img.tasks = new Listr([
		{
			title: `Copy images`,
			task: () => nova.ext.img(img.dir)
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
				signale.success(`Image Copying Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: Image Copying Didn't Finish")
				return reject(err)
			}
		})
		
	}
  }
  
  