const js =
  devBuild === 'pro'
    ? `mkdirp ${dir.dist} && uglifyjs ${dir.srcJS} -o ${dir.dist}/scripts.min.js && echo JS files uglified to ${dir.dist} in ${devBuild} mode`
    : `mkdirp ${dir.tmpScripts} && echo > ${dir.tmpScripts}/${projectName}.js.map && uglifyjs ${dir.srcJS} -b --source-map ${dir.tmpScripts}/${projectName}.js.map -o ${dir.tmpScripts}/${projectName}.js && echo JS files uglified to ${dir.tmpScripts} in ${devBuild} mode` // In pro mode, makes dist directory if it doesn't exist, then uglifies (compiles and minifies) js files into one scripts.min.js in dist. In dev mode, makes tmp/scripts if it doesn't exist, creates an empty ProjectName.js.map file, then uglifies (compiles and beautifies) js files into one ProjectName.js file in tmp/scripts and fills the sourcemaps file.

//scss.js
module.exports = nova => {
  nova.ext.jsAll = async options => {
    require('./extensions.js')(nova, options)
    const color = require('log-utils')
    const Listr = require('listr')
    const { dest, scss, prefix, cssmin } = nova.ext
    const dir = await dest('scripts')
    const css = await dest('js')

    const tasks = new Listr([
      {
        title: `Transpile .js files`,
        task: () => scss(dir, options)
      },
      {
        title: `Prefix .css files`,
        task: () => prefix([css, dir], options)
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
