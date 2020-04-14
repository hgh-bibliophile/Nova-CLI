module.exports = (nova) => {
	nova.ext.prettify = async (options) => {
		require("./extensions.js")(nova, options)
		const color = require("log-utils")
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

		const ran = new Promise(async (resolve) => {
			try {
				await tasks.run().catch((err) => {
					console.error(err)
				})
				console.log(color.green(`Prettifying Complete`))
				return resolve(true)
			} catch {
				console.log(
					color.red(`${color.error} Error Occurred: Prettifying Didn't Finish`)
				)
				return resolve(true)
			}
		})
		return ran
	}
}
