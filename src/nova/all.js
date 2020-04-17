const Listr = require('listr')
let all = {}
module.exports = async (nova, options, signale, debug) => {
	all.setup = async () => {
		require('./index.js')(nova, options, signale, debug)
	},
	all.tasks =  new Listr([
		{
			title: `$ nova scss` + (options.pro ? ` --pro` : ``),
			enabled: () =>true,
			task: () => nova.listr.scss()
		},
		{
			title: `$ nova js` + (options.pro ? ` --pro` : ``),
			enabled: () => true,
			task: () => nova.listr.js()
		},
		{
			title: `$ nova prettify`,
			enabled: () => true,
			task: () => nova.listr.prettify()
		},
		{
			title: `$ nova img` + (options.pro ? ` --pro` : ``),
			enabled:  () => false,
			task: () => nova.listr.img()
		}
		], {
			concurrent: true,
			collapse: false
	}),
	nova.ext.runAll = async () => {
		await all.setup()		
		return new Promise(async (resolve,reject) => {
			try {
				await all.tasks.run()
				signale.success(`All Commands Ran Successfully`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: Run All Command Didn't Finish")
				return reject(err)
			}
		})
	}
}
 