module.exports = nova => {
    nova.ext.imgAll = async options => {
      require('./extensions.js')(nova, options)
      const signale = require('signale')
      const Listr = require('listr')
      const { dest, imgmin, imgcp } = nova.ext
      const dir = await dest('photos')
      const opt = require('../config.js')
      const tasks = new Listr([
        {
          title: `Optimize images`,
	  enabled: () => !opt.exe,
          task: () => imgmin(dir)
        },
	{
          title: `Copy images`,
	  enabled: () => opt.exe,
          task: () => imgcp(dir)
        }
      ])
  
      return new Promise(async (resolve,reject) => {
        try {
          await tasks.run()
          signale.success(`Image Optimizing Complete`)
          return resolve(true)
        } catch (err) {
          signale.error("Error Occurred: Image Optimizing Didn't Finish")
          return reject(err)
        }
      })
    }
  }
  