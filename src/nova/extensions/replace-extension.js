module.exports = (nova, opts) => {
    nova.ext.replace = async (outDir, ext, opt) => {
	const replace = require('replace-in-file');
	const dir = require('../../config.js')
	
	const index = {find: new RegExp(/\"(\w|\/|\-|\.)*(index|home).*\.html\"/ig), to: '"index.html"'}
	const about = {find: new RegExp(/\"(\w|\/|\-|\.)*about.*\.html\"/ig), to: '"about.html"'}
	const contact = {find: new RegExp(/\"(\w|\/|\-|\.)*contact.*\.html\"/ig), to: '"contact.html"'}
	const styles = {find: new RegExp(/styles\/.*\.css/ig), to: 'styles.min.css'}
	const scripts = {find: new RegExp(/scripts\/.*\.js/ig), to: 'scripts.min.js'}
	const photos = {find: new RegExp(/(\.\.\/)*photos\//ig), to: 'photos/'}
	const find = [index.find, about.find,contact.find,styles.find,scripts.find, photos.find]
	const to = [index.to, about.to,contact.to,styles.to,scripts.to, photos.to]
	return new Promise(async function(resolve, reject) {
		try {
			/*await replace({
				files: dir.dist.root+'/*',
				from: find,
				to: to
			})*/
			const results = await replace({
				files: dir.dist.root+'/*',
				from: find,
				to: to,
				countMatches: true,
				dry: true
			});
			const cf = results.filter(result => result.hasChanged)
			console.log('Replacement results:')
				console.log('----------')
			for (let i = 0; i < cf.length; i++) {
				let cfn = cf[0]
				console.log(cfn.file)
				console.log(cfn.numMatches, 'matches were found','|',cfn.numReplacements, 'replacements were made.')
				console.log('----------')
			}
			return resolve(true)
		}
		catch (error) {
			return reject(err)
		}
	})
  }
}
