//scss.js
module.exports = nova => {
  nova.ext.scssAll = async options => {
    require('./extensions.js')(nova, options)
    const color = require('log-utils')
    const Listr = require('listr')
    const { dest, scss, prefix, cssmin, pretty } = nova.ext
    const dir = await dest('styles')
    const css = await dest('css')

    const tasks = new Listr([
      {
        title: `Compile .scss files`,
        task: () => scss(dir, options)
      },
      {
        title: `Prefix .css files`,
        task: () => prefix([css, dir], options)
      },
      {
        title: 'Prettify .css files',
        enabled: () => !options.pro,
        task: () => pretty('css', 'tmp')
      },
      {
        title: 'Minify .css files',
        enabled: () => options.pro,
        task: () => cssmin([css, dir], options)
      }
    ])

    const ran = new Promise(async resolve => {
      try {
        await tasks.run().catch(err => {
          console.error(err)
        })
        console.log(color.green(`SCSS Compiling and Optimizing Complete`))
        return resolve(true)
      } catch {
        console.log(
          color.red(
            `${color.error} Error Occurred: SCSS Compiling Didn't Finish`
          )
        )
        return resolve(true)
      }
    })
    return ran
  }
}
