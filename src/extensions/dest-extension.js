module.exports = toolbox => {
    toolbox.dest = async (outputDir) => {
        const dir = require('../config/pathVar.js')
        const {opt} = toolbox
        if (await opt('dev')) {
            return dir.tmp[outputDir]
        } else if (await opt('pro') === true) {
            return dir.dist[outputDir]
        } else {
            return dir.tmp[outputDir]
        }

    }
}