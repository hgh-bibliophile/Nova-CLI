module.exports = (nova, args) => {
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
    return new Promise(async function(resolve) {
      await renamer.rename({
        files: fileGlob,
        find: iffExt,
        replace: newExt,
        force: true
      })
      if (renamedext) {
        return resolve(renamedext)
      } else {
        return resolve()
      }
    })
  },
  nova.ext.file = async (dir, ext, opt) => {
	const Renamer = require('easy-renamer')
	const path = require('path')
	const glob = require('matched')
	const fs = require('fs')
	const renamer = new Renamer()
	let dirGlob

	function filename(name, ext) {
		return (file) => {
			optExt = opt==='min' || args.pro ? `.min` : file.extname === '.map'  ? `.${ext}` : ''
			return path.join(file.dirname, name + optExt+ file.extname)
		}
	}
    
	const index = '((H|h)ome|(I|i)ndex)'
	const about = '(A|a)bout'
	const contact = '(C|c)ontact'
	const styles = '.(css|scss|sass)'
	const scripts = '.js'
	if (!ext) {
		dirGlob = dir + '/**/*'
		renamer.matcher(index, filename('index'))
		renamer.matcher(about, filename('about'))
		renamer.matcher(contact, filename('contact'))
		renamer.matcher(styles, filename('styles', 'css'))
		renamer.matcher(scripts, filename('scripts', 'js'))
	} else if (ext==='html') {
		dirGlob = dir + '/**/*.html'
		renamer.matcher(index, filename('index'))
		renamer.matcher(about, filename('about'))
		renamer.matcher(contact, filename('contact'))
	} else if (ext==='css') {
		dirGlob = dir + '/**/*.css'
		renamer.matcher(styles, filename('styles', 'css'))
	} else if (ext==='js') {
		dirGlob = dir + '/**/*.js'
		renamer.matcher(scripts, filename('scripts', 'js'))
	}
        
	return new Promise(async (resolve, reject) => {
		try {
			await glob(dirGlob, {nodir: true, ignore: ['**/photos/*']}, (err, files) => {
			if (err) return reject(err)
			files.forEach((fp) =>{
				if (fp === renamer.rename(fp)) return
				fs.rename(fp, renamer.rename(fp), (err) => {
					if (err) return reject(err)
				})
			})
			return resolve(true)
			})
		} catch (err) {
			return reject(err)
		}
	})
  }
}
