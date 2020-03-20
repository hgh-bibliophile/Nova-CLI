
module.exports = {
    name: 'scss',
    alias: 's',
    description: `Compile .scss files to output directory`,
    run: async (toolbox, args) => {
      const {opt, dest, print } = toolbox
      const dev = await opt("dev", true)
      const dirc = await dest("styles")
      const css = await dest('css')
      let pro = await toolbox.pro()
      if (args) {
         pro = args.options.pro ? true : false
      }
      const ran = new Promise ( async (resolve) => {
        try {
          await toolbox.scss(dirc, dev)
          await toolbox.prefix([css, dirc], dev)
          await toolbox.cssmin([css, dirc], pro)
          print.success(`SCSS Compiling and Optimizing Complete`)
          return resolve(true)
        } catch {
          print.error("Error Occurred: SCSS Compiling Didn't Finish")
          return resolve(true)
        }
      })
      //await toolbox.menu.showMenu('npcs')*/
    }
}

