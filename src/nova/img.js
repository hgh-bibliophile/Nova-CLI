module.exports = nova => {
    nova.ext.imgAll = async options => {
      require('./extensions.js')(nova, options)
      const signale = require('signale')
      const Listr = require('listr')
      const { dest, imgmin } = nova.ext
      const dir = await dest('photos')
    
      const tasks = new Listr([
        {
          title: `Optimize images`,
          task: () => imgmin(dir)
        }
      ])
  
      return new Promise(async (resolve,reject) => {
        try {
          await tasks.run()
          signale.success(`Image Optimizing Complete`)
          return resolve(true)
        } catch (err) {
          signale.error(`Error Occurred: Image Optimizing Didn't Finish`)
          return reject(err)
        }
      })
    }
  }
  