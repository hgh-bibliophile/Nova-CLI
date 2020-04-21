const execa = require('execa')
const dir = require('../../config.js')
const glob = require('glob')
const fs = require('fs-extra')
const oldfs = require('fs')
const path = require('path')
const CleanCSS = require('clean-css')
const autoprefixer = require('autoprefixer')
const postcss = require('postcss')
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
	return new Promise(async (resolve, reject) => {
		const srcmps = options.dev ? { inline: false } : options.pro ? false : { inline: false }
		try {
			await glob(srcDir, {nodir: true, ignore: outDir + '/*.min.css'}, (err, files) => {
				if (err) return reject(err)
				files.forEach(async fp => {
					try {
						const css = await fs.readFile(fp)
						const result = await postcss([autoprefixer]).process(css, { from: fp, to: fp, map: srcmps })
						await fs.outputFile(fp, result.css)
						if ( result.map ) await fs.writeFile(fp + '.map', result.map)
						return resolve(true)
					} catch (err) {
						return reject(err)
					}
				})
			})			
		} catch (err) {
			return reject(err)
		}
	})
  },
	nova.ext.cssmin = async ([srcDir, outDir]) => {
		return new Promise(async (resolve, reject) => {
			if (!options.pro) return resolve(true)
			try {
				await glob(srcDir, {ignore: outDir + '/*.min.css'}, async (err, files) => {
					try {
						const output = await new CleanCSS({ returnPromise: true }).minify(files)
						await files.forEach(file => 	fs.writeFile(file, output.styles))
						await nova.ext.rename('css')
						return resolve(true)
					} catch (err) {
						return reject(err)
					}
				})
			} catch (err) {
				return reject(err)
			}
		})
	}
}
