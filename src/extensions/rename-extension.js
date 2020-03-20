module.exports = toolbox => {
    toolbox.ext = (outDir, type) => {
        const {
            print,
            cmd,
            run
        } = toolbox
        const dir = require('../config/pathVar.js')
        const before = outDir + "/" + dir.name + "." + type
        const after = dir.name + ".min" + "." + type


        var renamepromise = new Promise(function (resolve) {
            let renamed = toolbox.filesystem.rename(`${before}`, `${after}`)
            if (renamed) { 
                resolve(renamed);
            }
        })
        return renamepromise
    }
}


