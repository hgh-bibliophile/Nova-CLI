const Listr = require('listr')
let html = {}
module.exports = async (nova, options, signale, debug)=> {
	html.setup = async () => {
		require('../utils.js')(nova, options, signale, debug)
		html.dir = await nova.ext.dest('root')
		html.src = require('../../config.js').src.root
	},
	html.tasks = new Listr([
		{
			title: 'Minify .html files',
			enabled: () => options.pro,
			task: () => nova.ext.html(html.dir)
		},
		{
			title: 'Copy .html files',
			enabled: () => !options.pro,
			task: () => nova.ext.copy(html.src, html.dir, 'html')
		},
		{
			title: 'Prettify .html files',
			enabled: () => !options.pro,
			task: () => nova.ext.pretty('html', 'tmp')
		}
	]),
	nova.listr.html = async () => {
		await html.setup()
		return html.tasks
	},
	nova.ext.htmlAll = async () => {
		await html.setup()
		return new Promise(async (resolve, reject) => {
			try {
				await html.tasks.run()
				signale.success(`JS Transpiling and Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: JS Transpiling Didn't Finish")
				return reject(err)
			}
		})
	}
}