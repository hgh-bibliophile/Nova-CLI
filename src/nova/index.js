module.exports = (nova, options, signale, debug) => {
	require('./scss.js')(nova, options, signale, debug)
	require('./js.js')(nova, options, signale, debug)
	require('./img.js')(nova, options, signale, debug)
	require('./html.js')(nova, options, signale, debug)
	require('./prettify.js')(nova, options, signale, debug)
	require('./all.js')(nova, options, signale, debug)
	require('./extensions.js')(nova, options, signale, debug)
}