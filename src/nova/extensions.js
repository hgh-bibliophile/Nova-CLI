module.exports = (nova, options, signale, debug) => {
  require('./extensions/scss-extension.js')(nova, options, signale, debug)
  require('./extensions/js-extension.js')(nova, options, signale, debug)
  require('./extensions/img-extension.js')(nova, options, signale, debug)
  require('./extensions/prettier-extension.js')(nova, options, signale, debug)
  require('./extensions/dest-extension.js')(nova, options, signale, debug)
  require("./extensions/rename-extension.js")(nova, options, signale, debug)
  require("./extensions/replace-extension.js")(nova, options, signale, debug)
}
