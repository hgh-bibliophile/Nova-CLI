module.exports = nova => {
    nova.ext.imgAll = async options => {
      require('./extensions.js')(nova, options)
      const color = require('log-utils')
      const Listr = require('listr')
      const { dest, imgmin } = nova.ext
      const dir = await dest('photos')
    
      const tasks = new Listr([
        {
          title: `Optimize images`,
          task: () => imgmin(dir)
        }
      ])
  
      const ran = new Promise(async resolve => {
        try {
          await tasks.run().catch(err => {
            console.error(err)
          })
          console.log(color.green(`Image Optimizing Complete`))
          return resolve(true)
        } catch {
          console.log(
            color.red(
              `${color.error} Error Occurred: Image Optimizing Didn't Finish`
            )
          )
          return resolve(true)
        }
      })
      return ran
    }
  }
  