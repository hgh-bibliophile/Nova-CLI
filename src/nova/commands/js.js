const Listr = require('listr')
let js = {}
let test
module.exports = async (nova, options, signale, debug)=> {
	js.setup = async () => {
		require('../utils.js')(nova, options, signale, debug)
		js.dir = await nova.ext.dest('scripts')
	},
	js.tasks = new Listr([
		{
			title: 'Transpile ' + (options.pro ? `and minify `: ``)+ '.js files',
			task: () => nova.ext.js(js.dir)
		},
		{
			title: 'Prettify .js files',
			enabled: () => !options.pro,
			task: () => nova.ext.pretty('js', 'tmp')
		}
	]),
	nova.listr.js = async () => {
		await js.setup()
		return js.tasks
	},
	nova.ext.jsAll = async () => {
		await js.setup()
		return new Promise(async (resolve, reject) => {
			try {
				await js.tasks.run()
				debug.info('Files transpiled to:', js.dir)
				signale.success(`JS Transpiling and Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: JS Transpiling Didn't Finish")
				return reject(err)
			}
		})
	}
}

