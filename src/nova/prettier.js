module.exports = (nova) => {
	nova.ext.prettify = async (options) => {
		require("./extensions.js")(nova, options)
		const color = require("log-utils")
		const Listr = require("listr")
		const { pretty } = nova.ext

		const skipAll = () => {
			if (options.all) {
				return "--all flag specified, overides other flags"
			}
		}

		const tasks = new Listr([
			{
				title: "Prettify .html files",
				enabled: () => options.html,
				skip: () => skipAll(),
				task: () => pretty("html"),
			},
			{
				title: "Prettify .scss files",
				enabled: () => options.scss,
				skip: () => skipAll(),
				task: () => pretty("scss"),
			},
			{
				title: "Prettify .js files",
				enabled: () => options.js,
				skip: () => skipAll(),
				task: () => pretty("js"),
			},
			{
				title: "Prettify all files",
				enabled: () => options.all,
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
