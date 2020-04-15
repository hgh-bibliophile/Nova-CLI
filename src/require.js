module.exports = (nova, options) => {
//Extensions
  require('./nova/extensions/scss-extension.js')(nova)
  require('./nova/extensions/js-extension.js')(nova)
  require('./nova/extensions/img-extension.js')(nova)
  require('./nova/extensions/prettier-extension.js')(nova)
  require('./nova/extensions/dest-extension.js')(nova, options)
  require('./nova/extensions/rename-extension.js')(nova, options)
  require('./nova/extensions/replace-extension.js')(nova, options)

}