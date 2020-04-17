const Listr = require('listr')
let scss= {}
module.exports = async (nova, options, signale, debug) => {
	scss.setup = async () => {
		require('./extensions.js')(nova, options, signale, debug)
		scss.css = await nova.ext.dest('css')
		scss.dir = await nova.ext.dest('styles')
	},
	scss.tasks = new Listr([
	      {
		title: `Compile .scss files`,
		task: () => nova.ext.scss(scss.dir, options)
	      },
	      {
		title: `Prefix .css files`,
		task: () => nova.ext.prefix([scss.css, scss.dir], options)
	      },
	      {
		title: 'Prettify .css files',
		enabled: () => !options.pro,
		task: () => nova.ext.pretty('css', 'tmp')
	      },
	      {
		title: 'Minify .css files',
		enabled: () => options.pro,
		task: () => nova.ext.cssmin([scss.css,scss.dir], options)
		}		
	]),
	nova.listr.scss = async () => { 
		await scss.setup() 
		return scss.tasks
	},
	nova.ext.scssAll = async () => {
		await scss.setup()
		return new Promise(async (resolve,reject) => {
			try {
				await scss.tasks.run()
				debug.info('Files compiled to:', scss.dir)
				signale.success(`SCSS Compiling and Optimizing Complete`)
				return resolve(true)
			} catch (err) {
				signale.error("Error Occurred: SCSS Compiling Didn't Finish")
				return reject(err)
			}
		})
	}
}
