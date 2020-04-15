module.exports = nova => {
  nova.ext.ext = async (outDir, ext, opt) => {
    const RenamerJS = require('renamer/index.js')
    const renamer = new RenamerJS()
    let renamedext = false

    const iffExt = new RegExp(`(${opt}\.)*${ext}$`) //Daddy's Way
    //const iffExt = new RegExp(`(?<!${opt}\.)${ext}$`)//Lookbehind Way
    const newExt = opt + '.' + ext

    const files = outDir + '/*'
    const fileGlob = [files]

    renamer.on('replace-result', replaceResult => {
      renamedext = replaceResult.renamed
    })
    const renamepromise = new Promise(async function(resolve) {
      await renamer.rename({
        files: fileGlob,
        find: iffExt,
        replace: newExt,
        force: true
      })
      if (renamedext) {
        resolve(renamedext)
      } else {
        resolve()
      }
    })
    return renamepromise
  },
  nova.ext.file = async (dir) => {
    var Renamer = require('easy-renamer');
    var renamer = new Renamer();
    var path = require('path');
    var glob = require('matched');
    var fsys = require('fs')

    const dirGlob = dir + '/**/*'

    function filename(name) {
      return function(file) {
        return path.join(file.dirname, name + file.extname);
      };
    }
    const index = '((H|h)ome|(I|i)ndex)'//new RegExp(/(home|index).*\.html$/i)
    const about = '(A|a)bout' //new RegExp(/about.*\.html$/i)
    const contact = '(C|c)ontact' //new RegExp(/contact.*\.html$/i)
    const styles = '.(css|scss|sass)'//new RegExp(/.*\.(css|scss|sass)$/i)
    const scripts = '.js'//new RegExp(/.*\.js$/i)
    renamer.matcher(index, filename('index'))
    renamer.matcher(about, filename('about'))
    renamer.matcher(contact, filename('contact'))
    renamer.matcher(styles, filename('styles'))
    renamer.matcher(scripts, filename('scripts'))
    //TODO: Save .min ext

    
    const renamepromise = new Promise(async function(resolve, reject) {
      try {
        await glob(dirGlob, function(err, files) {
          let rnmNum = 0
          if (err) return reject(err)
          files.forEach(function(fp) {
            fsys.rename(fp, renamer.rename(fp), (err) => {
              if (err) throw err
              rnmNum++
            })
          })
          console.log(rnmNum + " files renamed")
        })
        return resolve()
      } catch (err) {
        return reject(err)
      }
    })
    return renamepromise
  }
}
