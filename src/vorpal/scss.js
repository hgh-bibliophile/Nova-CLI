
module.exports = (vorpal, toolbox) => {
    vorpal.ext.scssAll = async (options) => {
      require('./extensions/scss-extension.js')(vorpal, toolbox)
      require('./extensions/dest-extension.js')(vorpal, options)
      const { print } = toolbox
      const { dest } = vorpal.ext
      const dir = await dest("styles")
      const css = await dest('css')

      const { scss, prefix, cssmin } = vorpal.ext
      const ran = new Promise ( async (resolve) => {
        try {
            await scss(dir, options)
            await prefix([css, dir], options)
            await cssmin([css, dir], options)
            vorpal.log(`SCSS Compiling and Optimizing Complete`)
            return resolve(true)
          } catch {
            vorpal.log("Error Occurred: SCSS Compiling Didn't Finish")//TODO: Print in color
            return resolve(true)
          }
      })
      return ran
    }
}

