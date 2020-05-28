const execa = require('execa')
const dir = require('../../config.js')
const fs = require('fs-extra')
const glob = require('glob')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')

const promisify = require('util').promisify
const rimraf = promisify(require('rimraf'))

module.exports = (nova, options, signale, debug) => {
  nova.ext.scss = async (outputDir, args) => {
    return new Promise(async (resolve, reject) => {
        const srcmps = options.dev
		? `--source-map`
		: options.pro
		? `--no-source-map`
		: `--source-map`
	try {
		await execa.command(`${dir.execa.sass} ${srcmps} ${dir.src.styles}:${outputDir}`, dir.execa.config)
		return resolve(true)
	} catch (err) {
		return reject(err)
	}
	})
    
  },
  nova.ext.prefix = async ([srcDir, outDir]) => {
	return new Promise((resolve, reject) => {
		const srcmps = options.dev ? { inline: false } : options.pro ? false : { inline: false }
		try {
			glob(srcDir, {nodir: true, ignore: outDir + '/*.min.css'}, (err, files) => {
				if (err) return reject(err)
				files.forEach(async fp => {
					try {
						//const exists = await fs.pathExists(fp)
						//if (!exists) return
						const css = await fs.readFile(fp).catch(err => {throw new Error(err + files)})
						const result = await postcss([autoprefixer]).process(css, { from: fp, to: fp, map: srcmps })
						await fs.outputFile(fp, result.css)
						if ( result.map ) await fs.writeFile(fp + '.map', result.map.toString())
					} catch (err) {
						return reject(err)
					}
				})
				return resolve(true)
			})
		} catch (err) {
			return reject(err)
		}
	})
  },
	nova.ext.cssmin = async ([srcDir, outDir]) => {
		return new Promise(async (resolve, reject) => {
			if (!options.pro) return resolve(true)
			glob(srcDir,{nodir: true, ignore: [outDir + '/*min.css']},async (err, paths)=> {
				if (err) return reject(err)
				const path = paths.toString()
				try {
					await execa.command(`${dir.execa.cleancss} --skip-rebase -o ${path} ${path}`, dir.execa.config)
					await nova.ext.refresh('css')
					return resolve(true)
				} catch (err) {
					return reject(err)
				}
			} )
			
		})
	}
}
