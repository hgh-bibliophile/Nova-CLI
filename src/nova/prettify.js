const Listr = require('listr')
let prettify = {}
module.exports = async (nova, options, signale, debug) => {
	prettify.setup = async () => {
		require('./extensions.js')(nova, options, signale, debug)
		prettify.all = !options.html && !options.scss && !options.js
	},
	prettify.tasks = new Listr([
		{
			title: "Prettify .html files",
			enabled: () => options.html,
			task: () => nova.ext.pretty("html"),
		},
		{
			title: "Prettify .scss files",
			enabled: () => options.scss,
			task: () => nova.ext.pretty("scss"),
		},
		{
			title: "Prettify .js files",
			enabled: () => options.js,
			task: () => nova.ext.pretty("js"),
		},
		{
			title: "Prettify all files",
			enabled: () => prettify.all,
			task: () => nova.ext.pretty("all"),
		},
	]),
	nova.listr.prettify = async () => { 
		await prettify.setup() 
		return prettify.tasks
	},
	nova.ext.prettifyAll = async () => {
		await prettify.setup()
		return new Promise(async (resolve, reject) => {
			try {
				await prettify.tasks.run()
				signale.success(`Prettifying Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: Prettifying Didn't Finish")
				return reject(err)
			}
		})
	}
}
