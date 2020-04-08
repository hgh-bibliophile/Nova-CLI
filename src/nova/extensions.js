module.exports = (nova, options) => {
  require('./extensions/js-extension')(nova)
  require('./extensions/scss-extension.js')(nova)
  require('./extensions/dest-extension.js')(nova, options)
  require('./extensions/rename-extension')(nova)
}
