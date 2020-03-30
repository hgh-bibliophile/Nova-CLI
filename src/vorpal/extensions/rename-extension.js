module.exports = (vorpal) => {
    vorpal.ext.ext = async (outDir, ext, opt) => {
        const RenamerJS = require('renamer/index.js')
        const renamer = new RenamerJS()
        let renamedfiles = false

        const iffExt = new RegExp(`(${opt}\.)*${ext}$`)//Daddy's Way
        //const iffExt = new RegExp(`(?<!${opt}\.)${ext}$`)//Lookbehind Way
        const newExt = opt + "." + ext

        const files = outDir + "/*"
        const fileGlob = [files]

        renamer.on('replace-result', replaceResult => {
            renamedfiles = replaceResult.renamed
        })
        const renamepromise = new Promise(async function (resolve) {
            await renamer.rename({
                files: fileGlob,
                find: iffExt,
                replace: newExt,
                force: true
            })
            if (renamedfiles) {
                resolve(renamedfiles);
            } else {
                resolve()
            }
        })
        return renamepromise
    }
}