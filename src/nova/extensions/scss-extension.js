const execa = require('execa')
const dir = require('../../config.js')
const glob = require('glob')
const fs = require('fs-extra')
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
		await execa.command(`${dir.execa.sass} ${srcmps} --update ${dir.src.styles}:${outputDir}`, dir.execa.config)
		return resolve(true)
	} catch (err) {
		return reject(err)
	}
	})
    
  },
  nova.ext.prefix = ([srcDir, outDir]) => {
	return new Promise(async (resolve, reject) => {
		const srcmps = options.dev ? '{ inline: false }' : options.pro ? false : { inline: false }
		try {
			await glob(srcDir, {nodir: true, ignore: outDir + '/*.min.css'}, (err, files) => {
				if (err) return reject(err)
				files.forEach(fp => {
					fs.readFile(fp, (err, css) => {
						postcss([autoprefixer])
							.process(css, { from: fp, to: fp, map: srcmps })
							.then(result => {
								fs.outputFile(fp, result.css, () => true)
								if ( result.map ) fs.outputFile(fp + '.map', result.map, () => true)	
							})
					})
				})
			})		
			return resolve(true)
		} catch (err) {
			return reject(err)
		}
	})
  },
  nova.ext.cssmin = ([srcDir, outDir]) => {
    return new Promise(async (resolve, reject) => {
      if (options.pro) {
        try {
	await glob(srcDir, {nodir: true, ignore: outDir + '/*.min.css'}, (err, files) => {
		if (err) return reject(err)
		new CleanCSS({ returnPromise: true }).minify(files)
		.then(output => {
			fs.outputFile(files[0], output.styles)
		})
		.catch(err => reject(err))
	})
	await nova.ext.file(outDir, 'css', 'min')
        return resolve(true)
      } catch (err) {
        return reject(err)
      }
    }
    })
  }
}
