const prettier = `prettier`
const execa = require('execa')
module.exports = (nova) => {
    nova.ext.pretty = (outDir, dirc) => {
        const dir = require('../../config/pathVar.js')
        subDir = dirc || 'src'
        const folderDir = dir[subDir].root
        let fileDir = folderDir[outDir]
        if (outDir === "all") fileDir = folderDir
        var prettypromise = new Promise(async (resolve, reject) => {
        try {
          await execa.command(`${prettier} --use-tabs --write ${fileDir}`,
            { preferLocal: true }
          )
          resolve(true)
        } catch (error) {
          reject(error)
        }
      })
      return prettypromise
    }
}