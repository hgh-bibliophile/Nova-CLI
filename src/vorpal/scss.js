
module.exports = (vorpal) => {
    vorpal.ext.scssAll = async (options) => {
      require('./extensions/scss-extension.js')(vorpal)
      require('./extensions/dest-extension.js')(vorpal, options)
      const color = require('log-utils')
      const { dest } = vorpal.ext
      const dir = await dest("styles")
      const css = await dest('css')

      const { scss, prefix, cssmin } = vorpal.ext
      const ran = new Promise ( async (resolve) => {
        try {
            //await scss(dir, options)
            //await prefix([css, dir], options)
            await cssmin([css, dir], options)
            console.log(color.green(`SCSS Compiling and Optimizing Complete`))
            return resolve(true)
          } catch {
            console.log(color.red(`${color.error} Error Occurred: SCSS Compiling Didn't Finish`))
            return resolve(true)
          }
      })
      return ran
    }
}

