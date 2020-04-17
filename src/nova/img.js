const Listr = require('listr')
let img = {}
module.exports = async (nova, options, signale, debug) => {
	img.setup = async () => {
		require('./extensions.js')(nova, options, signale, debug)
		const opt = require('../config.js')
		const dir = await nova.ext.dest('photos')
		img.opt = opt
		img.dir = dir
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
			task: () => nova.extimgcp(img.dir)
		}
	]),
	nova.listr.img = async () => { 
		await img.setup() 
		return img.tasks 
	},
	nova.ext.scssAll = async () => {
		await img.setup()
		return new Promise(async (resolve,reject) => {
			try {
				await scss.tasks.run()
				signale.info(scss.dir,scss.css)
				signale.success(`SCSS Compiling and Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: SCSS Compiling Didn't Finish")
				return reject(err)
			}
		})
	}
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
  
  