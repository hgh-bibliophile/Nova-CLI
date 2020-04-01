module.exports = (nova) => {
    nova.ext.scss = (outputDir, args) => {
        //require('./pwrshell-extension')(nova)
        const {
            cmd,
            run
        } = nova.ext
        const dir = require('../../config/pathVar.js')
        var scsspromise = new Promise(function (resolve) {
            const srcmps = args.dev ? `--source-map` : args.pro ? `--no-source-map` : `--source-map`
            const scss = cmd('sass', `${srcmps} ${dir.src.styles}:${outputDir}`);
            const ranscss = run(scss, ['Compiling SCSS files...', `SCSS files compiled to ${outputDir}`])
            if (ranscss) {
                resolve(ranscss);
            }
        })
        return scsspromise

    },
    nova.ext.prefix = ([srcDir, outDir], args) => {
        //Defines Dependencies
        require('./pwrshell-extension')(nova)
        const {
            cmd,
            run
        } = nova.ext
        var prefixpromise = new Promise(function (resolve) {
            const srcmps = args.dev ? `--map` : args.pro ? `--no-map` : `--map`
            const prefix = cmd('npx postcss', `${srcDir} --use autoprefixer ${srcmps} -d ${outDir}`)
            const ranprefix = run(prefix, ['Prefixing CSS files...', `CSS files in ${outDir} prefixed`])
            if (ranprefix) {
                resolve(ranprefix);
            }
        })
        return prefixpromise
    },
    nova.ext.cssmin = ([srcDir, outDir], args) => {
        require('./pwrshell-extension')(nova)
        require('./rename-extension')(nova)
        const {
            cmd,
            run
        } = nova.ext
        var mincsspromise = new Promise(function (resolve) {
            if (args.pro) {
                const cssmin = cmd('npx postcss', `${srcDir} --no-map --use cssnano -d ${outDir}`)
                const ranmincss = run(cssmin, ['Minifying CSS files...', `CSS files in ${outDir} minified`]).then(nova.ext.ext(outDir, "css", "min")).then(true)
                if (ranmincss) {
                    resolve(ranmincss)
                } else {
                    resolve()
                }
            } else {
                resolve();
            }
        })
        return mincsspromise

    }
}