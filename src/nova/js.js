module.exports = nova => {
    nova.ext.jsAll = async options => {
      require('./extensions.js')(nova, options)
      const signale = require('signale')
      const Listr = require('listr')
      const { dest, js, pretty } = nova.ext
      const dir = await dest('scripts')
      const minspin = options.pro ? `and minify `: ``
    
      const tasks = new Listr([
        {
          title: `Transpile ${minspin}.js files`,
          task: () => js(dir, options)
        },
        {
          title: 'Prettify .js files',
          enabled: () => !options.pro,
          task: () => pretty('js', 'tmp')
        }
      ])
  
      return new Promise(async (resolve, reject) => {
        try {
          await tasks.run()
          signale.success(`JS Transpiling and Optimizing Complete`)
          return resolve(true)
        } catch (err) {
          signale.error(`Error Occurred: JS Transpiling Didn't Finish`)
          return reject(err)
        }
      })
    }
  }
  