module.exports = (nova, options, signale, debug) => {
	require('./commands/scss.js')(nova, options, signale, debug)
	require('./commands/js.js')(nova, options, signale, debug)
	require('./commands/prettify.js')(nova, options, signale, debug)
	require('./commands/img.js')(nova, options, signale, debug)
	require('./commands/html.js')(nova, options, signale, debug)
	require('./commands/all.js')(nova, options, signale, debug)
}