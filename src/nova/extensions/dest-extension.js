module.exports = (nova, options) => {
  nova.ext.dest = async outputDir => {
    const dir = require('../../config/pathVar.js')
    if (options.dev) {
      return dir.tmp[outputDir]
    } else if (options.pro) {
      return dir.dist[outputDir]
    } else {
      return dir.tmp[outputDir]
    }
  }
}
