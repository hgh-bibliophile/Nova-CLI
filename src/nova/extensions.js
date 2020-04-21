module.exports = (nova, options, signale, debug) => {
  require('./extensions/scss-extension.js')(nova, options, signale, debug)
  require('./extensions/js-extension.js')(nova, options, signale, debug)
  require('./extensions/img-extension.js')(nova, options, signale, debug)
  require('./extensions/prettier-extension.js')(nova, options, signale, debug)
  require('./extensions/html-extension.js')(nova, options, signale, debug)
  require("./extensions/utils-extension.js")(nova, options, signale, debug)
}
