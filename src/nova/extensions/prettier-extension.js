const prettier = `prettier`
const execa = require('execa')
module.exports = (nova) => {
    nova.ext.pretty = (outDir, dirc) => {
        const dir = require('../../config.js')
        subDir = dirc || 'src'
        const folderDir = dir[subDir]
        let fileDir = folderDir[outDir]
        if (outDir === "all") fileDir = folderDir.root
        return new Promise(async (resolve, reject) => {
          try {
            await execa.command(`${prettier} --use-tabs --write ${fileDir}`,
              dir.execa
            )
            return resolve(true)
          } catch (error) {
            return reject(error)
          }
      })
    }
}