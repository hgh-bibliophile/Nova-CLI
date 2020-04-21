const Renamer = require('easy-renamer')
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')
const replace = require('replace-in-file');
const dir = require('../../config.js')
const gfs = require('graceful-fs')
const promisify = require('util').promisify
const rimraf = promisify(require('rimraf'))
const rename = promisify(gfs.rename)
module.exports = (nova, options, signale, debug) => {
	nova.ext.base = (globs, dir) => {
		return new Promise((resolve, reject) => {
			glob(globs, {nodir: true, ignore: '**/_*'}, (err, files) => {
				if (err) return reject(err)
				let base
				files.forEach(fp => {base = path.basename(fp, path.extname(fp))})
				const  name = dir + '/' + base + '.js'
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
			const filterFunc = async (src, dest) => {
				return src === srcDir || path.extname(src) === ('.' + type)
			}
			const filter = !type ? '' : { filter: filterFunc }
			fs.copy(srcDir, outDir, filter, (err) => {
				if (err) return reject(err)
				return resolve(true)
			})
		})
	},
	nova.ext.renameForce = async (oldPath, newPath) => {
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
	}
	nova.ext.file = async (gDir, ext, opt) => {
		gDir = !gDir ? dir.dist.root : gDir
		const renamer = new Renamer()
		const dirGlob = !ext || ext==='all'
		? gDir + '/**/*'
		: ext==='html'
		? gDir + '/**/*.html'
		: ext==='css'
		? gDir + '/**/*.css'
		: ext==='js'
		? gDir + '/**/*.js'
		: ext==='photos'
		? gDir + '/**/photos/**/*'
		: gDir + '/**/*'
	
		function filename(name, extn) {
			return (file) => {
				optExt = !extn
				? ''
				: (opt==='min' || options.pro)
				? `.min`
				: file.extname === '.map'
				? `.${extn}`
				: ''
				return path.join(file.dirname, name + optExt+ file.extname)
			}
		}
		function photo() {
			return (file) => {
				return path.join(file.dirname, file.filename.toLowerCase() + file.extname)
			}
		}
		const index = '((H|h)ome|(I|i)ndex)'
		const about = '(A|a)bout'
		const contact = '(C|c)ontact'
		const styles = '.(css|scss|sass)'
		const scripts = '.js'
		const photos = '.(png|jpeg|jpg)'
		const favicon = '.ico'
	
		renamer.matcher(index, filename('index'))
		renamer.matcher(about, filename('about'))
		renamer.matcher(contact, filename('contact'))
		renamer.matcher(styles, filename('styles', 'css'))
		renamer.matcher(scripts, filename('scripts', 'js'))
		renamer.matcher(photos, photo())
		renamer.matcher(favicon, photo())
		//FIXME
		return new Promise(async (resolve, reject) => {
			try {
				await glob(dirGlob, {nodir: true}, (err, files) => {
					if (err) return reject(err)
					files.forEach(fp => {
						nova.ext.renameForce(fp,renamer.rename(fp))
						.catch(err =>  reject(err))
					})
				})
				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	},
	nova.ext.replace = async (type) => {
		const regex = {
			index: {find: new RegExp(/\"(\w|\/|\-|\.)*(index|home)(\w|\/|\-|\.)*\.html\"/ig), to: '"index.html"'},
			about: {find: new RegExp(/\"(\w|\/|\-|\.)*about(\w|\/|\-|\.)*\.html\"/ig), to: '"about.html"'},
			contact: {find: new RegExp(/\"(\w|\/|\-|\.)*contact(\w|\/|\-|\.)*\.html\"/ig), to: '"contact.html"'},
			styles: {find: new RegExp(/styles\/.*\.css/ig), to: 'styles.min.css'},
			scripts: {find: new RegExp(/scripts\/.*\.js/ig), to: 'scripts.min.js'},
			photos: {find: new RegExp(/(\.\.\/)*photos\//ig), to: 'photos/'},
			img: {find: new RegExp(/(\.\.\/)*photos\/(\w|\/|\-|\.)*\.(ico|png|jpg|jpeg)/ig), to: (match) => match.toLowerCase()}
		}
		let find = []
		let to = []
		return new Promise(async function(resolve, reject) {
			if (type==='photos') return resolve(true)
			try {
				let fileType = dir.dist.root + '/*'
				if (type) fileType = await nova.ext.dest(type, 'dist')
				Object.entries(regex).forEach((([key, value]) => {
					find.push(value.find);
					to.push(value.to);
				}))
				await replace({
					files: fileType,
					from: find,
					to: to,
					countMatches: true
				})
				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	},
	nova.ext.rename = (type) => {
		return new Promise(async(resolve, reject) => {
			if (!options.pro) return resolve('Returned')
			const ext = type === 'js'||'css'
			? 'min'
			: false
			try {
				await nova.ext.file(dir.dist.root, type, ext)
				await nova.ext.replace(type)
				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	}
}

