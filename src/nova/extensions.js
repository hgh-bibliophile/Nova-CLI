module.exports = (nova, options) => {
  require('./extensions/scss-extension.js')(nova)
  require('./extensions/js-extension.js')(nova)
  require('./extensions/img-extension.js')(nova)
  require('./extensions/prettier-extension.js')(nova)
  require('./extensions/dest-extension.js')(nova, options)
  require('./extensions/rename-extension')(nova)
}
