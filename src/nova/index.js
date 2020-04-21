module.exports = (nova, options, signale, debug) => {
	const files = ['scss', 'js', 'prettify', 'img','html', 'all']
	files.forEach((name)=> {
		let path = './commands/' + name + '.js'
		require(path)(nova, options, signale, debug)
	})
}