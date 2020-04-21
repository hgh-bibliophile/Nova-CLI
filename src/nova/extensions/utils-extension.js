const RenamerJS = require('renamer/index.js')
const Renamer = require('easy-renamer')
const path = require('path')
const glob = require('glob')
const fs = require('fs-extra')
const replace = require('replace-in-file');
const dir = require('../../config.js')
module.exports = (nova, options, signale, debug) => {
	nova.ext.dest = (outputDir, mode = false) => {
		return new Promise(resolve => {
			const dir = require('../../config.js')
			if (mode === ('dev' || 'tmp') || options.dev) {
				return resolve(dir.tmp[outputDir])
			} else if (mode === ('pro'|| 'dist')||options.pro) {
				return resolve(dir.dist[outputDir])
			} else {
				return resolve(dir.tmp[outputDir])
			}
		})
	},
	nova.ext.copy = (srcDir, outDir) => {
		return new Promise(async(resolve, reject) => {
			await fs.mkdirp(outDir)
			fs.copy(srcDir, outDir, (err) => {
				if (err) return reject(err)
				return resolve(true)
			})
		})
	},
	nova.ext.file = async (dir, ext, opt) => {
		const renamer = new Renamer()
		let dirGlob
		function filename(name, extn) {
			return (file) => {
				optExt = !extn ? '' : (opt==='min' || options.pro) ? `.min` : file.extname === '.map'  ? `.${extn}` : ''
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
		if (!ext || ext === 'all') {
			dirGlob = dir + '/**/*'
			renamer.matcher(index, filename('index'))
			renamer.matcher(about, filename('about'))
			renamer.matcher(contact, filename('contact'))
			renamer.matcher(styles, filename('styles', 'css'))
			renamer.matcher(scripts, filename('scripts', 'js'))
			renamer.matcher(photos, photo())
			renamer.matcher(favicon, photo())
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
		} else if (ext==='photos') {
			dirGlob = dir + '/**/photos/**/*'
			renamer.matcher(photos, photo())
			renamer.matcher(favicon, photo())
		}
		return new Promise(async (resolve, reject) => {
			try {
				await glob(dirGlob, {nodir: true}, (err, files) => {
					if (err) return reject(err)
					files.forEach((fp) =>{
						const regFp = fp.replace(/\//g, '\\')
						renmFp = renamer.rename(fp)
						if (regFp === renmFp) return
						fs.rename(fp, renmFp, (err) => {
							if (err) return reject(err)
						})
						//const capture = nova.trace.at()
						//debug.scope(capture.line + ':' + capture.column).info('nova.ext.files\noriginal: ' + org + '\nrenamed: ' + renmFp)
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
			try {
				let fileType = dir.dist.root + '/*'
				if (type) fileType = await nova.ext.dest(type, 'dist')
				await Object.entries(regex).forEach(
					(([key, value])=> {
						find.push(value.find)
						to.push(value.to)})
				)
				const results = await replace({
					files: fileType,
					from: find,
					to: to,
					countMatches: true
				})
				//const changed = results.filter(result => result.hasChanged)
				//const capture = nova.trace.at()
				//changed.forEach((item) => {
					//debug.scope(capture.line + ':' + capture.column).info('nova.ext.replace\nfile:',item.file,'\n' + item.numMatches,'matches found', '|', item.numReplacements, 'strings replaced')
				//})
				return resolve(true)
			} catch (err) {
				return reject(err)
			}
		})
	},
	nova.ext.ext = async (outDir, ext, opt) => {
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
	}
}
