module.exports = nova => {
    nova.ext.jsAll = async options => {
      require('./extensions.js')(nova, options)
      const color = require('log-utils')
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
  
      const ran = new Promise(async resolve => {
        try {
          await tasks.run().catch(err => {
            console.error(err)
          })
          console.log(color.green(`JS Transpiling and Optimizing Complete`))
          return resolve(true)
        } catch {
          console.log(
            color.red(
              `${color.error} Error Occurred: JS Transpiling Didn't Finish`
            )
          )
          return resolve(true)
        }
      })
      return ran
    }
  }
  