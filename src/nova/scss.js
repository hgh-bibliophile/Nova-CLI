//scss.js
module.exports = (nova) => {
    nova.ext.scssAll = async (options) => {
      //require('./extensions/scss-extension.js')(nova)
      //require('./extensions/dest-extension.js')(nova, options)
      require('./extensions.js')(nova, options)
      const color = require('log-utils')
      const { dest } = nova.ext
      const dir = await dest("styles")
      const css = await dest('css')

      const { scss, prefix, cssmin } = nova.ext
      const ran = new Promise ( async (resolve) => {
        try {
            await scss(dir, options)
            await prefix([css, dir], options)
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