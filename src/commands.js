const signale = require('signale')
const Listr = require('listr')
let js = {}
module.exports = async (nova, options) => {
	js.setup = async () => {
		require('./extensions.js')(nova, options)
		js.dir = await nova.ext.dest('scripts')
	},
	js.tasks = new Listr([
		{
			title: 'Transpile ' + (options.pro ? `and minify `: ``)+ '.js files',
			task: () => nova.ext.js(js.dir, options)
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
				signale.success(`JS Transpiling and Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: JS Transpiling Didn't Finish")
				return reject(err)
			}
		})
	}
}

