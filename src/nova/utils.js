module.exports = (nova, options, signale, debug) => {
  require('./utils/scss-utils.js')(nova, options, signale, debug)
  require('./utils/js-utils.js')(nova, options, signale, debug)
  require('./utils/prettier-utils.js')(nova, options, signale, debug)
  require('./utils/img-utils.js')(nova, options, signale, debug)
  require('./utils/html-utils.js')(nova, options, signale, debug)
  require('./utils/helper-utils.js')(nova, options, signale, debug)
}
