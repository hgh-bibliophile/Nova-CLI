module.exports = (nova) => {
	nova.ext.prettify = async (options) => {
		require("./extensions.js")(nova, options)
		const signale = require('signale')
		const Listr = require("listr")
		const { pretty } = nova.ext

		const tasks = new Listr([
			{
				title: "Prettify .html files",
				enabled: () => options.html,
				task: () => pretty("html"),
			},
			{
				title: "Prettify .scss files",
				enabled: () => options.scss,
				task: () => pretty("scss"),
			},
			{
				title: "Prettify .js files",
				enabled: () => options.js,
				task: () => pretty("js"),
			},
			{
				title: "Prettify all files",
				enabled: () => !options.html && !options.scss && !options.js,
				task: () => pretty("all"),
			},
		])

		return new Promise(async (resolve, reject) => {
			try {
				await tasks.run()
				signale.success(`Prettifying Complete`)
				return resolve(true)
			} catch (err) {
				signale.error(`Error Occurred: Prettifying Didn't Finish`)
				return reject(err)
			}
		})
	}
}
