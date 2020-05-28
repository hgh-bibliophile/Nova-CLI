const renamer = new require('easy-renamer')()
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')
const dir = require('../../config.js')
const gfs = require('graceful-fs')
const promisify = require('util').promisify
const rimraf = promisify(require('rimraf'))
const rename = promisify(gfs.rename)
const globber = require('fast-glob')
const through2 = require('./through2')
module.exports = (nova, options, signale, debug) => {
	nova.ext.base = (globs, dir, find, replace) => {
		return new Promise((resolve, reject) => {
			glob(globs, {nodir: true, ignore: '**/_*'}, (err, files) => {
				if (err) return reject(err)
				let base
				files.forEach(fp => {
					base = path.basename(fp)
					if (find) base.replace(find, replace)
				})
				const  name = dir + '/' + base
				return resolve(name)
			})
		})
	},
	nova.ext.dest = (outputDir, mode = false) => {
		return new Promise(resolve => {
			if (mode === ('dev' || 'tmp') || options.dev) {
				return resolve(dir.tmp[outputDir])
			} else if (mode === ('pro'|| 'dist')||options.pro) {
				return resolve(dir.dist[outputDir])
			} else {
				return resolve(dir.tmp[outputDir])
			}
		})
	},
	nova.ext.copy = (srcDir, outDir, type) => {
		return new Promise(async(resolve, reject) => {
			await fs.mkdirp(outDir)
			const filterFunc = async (src) => {
				const match = (i) => new RegExp(i, "gi").test(src)
				return src === srcDir || type.some(match)
			}
			fs.copy(srcDir, outDir, { filter: filterFunc }, (err) => {
				if (err) return reject(err)
				return resolve(true)
			})
			
		})
	},
	nova.ext.renameForce = async (oldPath, newPath) => {
		return new Promise(async(resolve) => {
			try {
				await rename(oldPath, newPath)
			} catch (err) {
				switch (err.code) {
					case 'ENOTEMPTY':
					case 'EEXIST':
						await rimraf(newPath)
						await rename(oldPath, newPath)
						break
					// weird Windows stuff
					case 'EPERM':
						await new Promise(resolve => setTimeout(resolve, 200))
						await rimraf(newPath)
						await rename(oldPath, newPath)
						break
					default:
						throw err
					}
			}
			return resolve(true)
		})
	}
	nova.ext.refresh = async (type) => {
		const gDir = dir.dist.root
		const dirGlob = !type || type ==='all'
		? gDir + '/**/*'
        : gDir + '/**/*.' + type
        //Photos
        const files = await globber(dirGlob, { ignore: [gDir + '/**/photos/**/*'], onlyFiles: true})

        const regexFindInFiles = {
            index: {find: new RegExp(/\"(\w|\/|\-|\.)*(index|home)(\w|\/|\-|\.)*\.html\"/ig), to: '"index.html"'},
            about: {find: new RegExp(/\"(\w|\/|\-|\.)*about(\w|\/|\-|\.)*\.html\"/ig), to: '"about.html"'},
            contact: {find: new RegExp(/\"(\w|\/|\-|\.)*contact(\w|\/|\-|\.)*\.html\"/ig), to: '"contact.html"'},
            styles: {find: new RegExp(/styles\/.*\.css/ig), to: 'styles.min.css'},
            scripts: {find: new RegExp(/scripts\/.*\.js/ig), to: 'scripts.min.js'},
            photos: {find: new RegExp(/(\.\.\/)*photos\//ig), to: 'photos/'},
            img: {find: new RegExp(/(\.\.\/)*photos\/(\w|\/|\-|\.|\&)*\.(ico|png|jpg|jpeg)/ig), to: (match) => match.toLowerCase()}
        }
        const index = '((H|h)ome|(I|i)ndex)'
        const about = '(A|a)bout'
        const contact = '(C|c)ontact'
        const styles = '.(css|scss|sass)'
        const scripts = '.js'
        const photos = '.(png|jpeg|jpg)'
        const favicon = '.ico'
                
        function photo() {
            return (file) => {
                return path.join(file.dirname, file.filename.toLowerCase() + file.extname)
            }
        }
		function filename(type, name, extn) {
            const opt = type === ('js'||'css')
            ? 'min'
            : false
            return (file) => {
				let optExt = !extn
                ? ''
                : (opt==='min' || options.pro)
                ? `.min`
                : file.extname === '.map'
                ? `.${extn}`
                : ''
                return path.join(file.dirname, name + optExt + file.extname)
            }
        }
	
		renamer.matcher(index, filename(type, 'index'))
		renamer.matcher(about, filename(type, 'about'))
		renamer.matcher(contact, filename(type, 'contact'))
		renamer.matcher(styles, filename(type, 'styles', 'css'))
		renamer.matcher(scripts, filename(type, 'scripts', 'js'))
		renamer.matcher(photos, photo())
        renamer.matcher(favicon, photo())
        
		return new Promise(async(resolve, reject) => {
			if (!options.pro) return resolve(true)
			if (type === 'photos') {
				try {
					const photos = await globber(dir.dist.img, { onlyFiles: true})
					for (const img of photos) {
						const newImg = renamer.rename(img)
						await nova.ext.renameForce(img, newImg)
					}
					return resolve(true)
				} catch (err) {
					return reject(err)
				}
			}
			try {
                for (const fp of files) {
                    const nfp = renamer.rename(fp)
                    let ofp = path.relative(process.cwd(),fp)
                    if (nfp === ofp) {
                        ofp = path.join(gDir, '/temp-' + path.basename(ofp))
                        await nova.ext.renameForce(fp, ofp)
                    }
                    
                    const replace = through2(function(chunk, enc, cb)  {
                        chunk = chunk.toString()
                        let data = chunk
                        Object.entries(regexFindInFiles).forEach((([key, value]) => {
                            data = data.replace(value.find, value.to)
                        }))
                        this.push(data)
                        cb()
                    })

                    var source = fs.createReadStream(ofp, 'utf8')
                    var dest = fs.createWriteStream(nfp, 'utf8')
                    source
                    .pipe(replace)
                    .pipe(dest)
                    .on('finish', async (err) => {
                        if (err) reject(err)
                        await rimraf(ofp)
                        //debug.info(`Refreshed File\nSource: ${ofp}\nDestination: ${nfp}`)
                    })
                    .on('error', (err) => {
                        return reject(err)
                    })
                }
				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	}
}

