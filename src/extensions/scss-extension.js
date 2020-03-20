module.exports = toolbox => {
    toolbox.scss = (outputDir, args, requires) => {
            const {
                print,
                cmd,
                run
            } = toolbox
            const dir = require('../config/pathVar.js')



            var scsspromise = new Promise(function (resolve) {
                const srcmps = args.dev ? `--source-map` : args.pro ? `--no-source-map` : `--source-map`

                const scss = cmd('sass', `${srcmps} ${dir.src.styles}:${outputDir}`);

                const ranscss = run(scss, ['Compiling SCSS files...', `${print.checkmark} SCSS files compiled to ${outputDir}`])
                if (ranscss) {
                    resolve(ranscss);
                }
            })
            return scsspromise

        },
        toolbox.prefix = ([srcDir, outDir], args) => {
            //Defines Dependencies
            const {
                print,
                cmd,
                run
            } = toolbox
            //Creates Promise for async/await
            var prefixpromise = new Promise(function (resolve) {
                //Defines commands based on given modes/directories
                const srcmps = args.dev ? `--map` : args.pro ? `--no-map` : `--map`
                const prefix = cmd('npx postcss', `${srcDir} --use autoprefixer ${srcmps} -d ${outDir}`)
                //Waits for run() to run before resolving promise
                const ranprefix = run(prefix, ['Prefixing CSS files...', `${print.checkmark} CSS files in ${outDir} prefixed`])
                if (ranprefix) {
                    resolve(ranprefix);
                }
            })
            return prefixpromise
        },
        toolbox.cssmin = ([srcDir, outDir], inmode) => {
            //Defines Dependencies
            const {
                print,
                cmd,
                run
            } = toolbox
            const dir = require('../config/pathVar.js')
            //Creates Promise for async/await
            var mincsspromise = new Promise(function (resolve) {
                if (inmode) {
                    //Defines commands based on given modes/directories
                    const mincss = cmd('npx postcss', `${srcDir} --no-map --use cssnano -d ${outDir}`)
                    //Waits for run() to run before resolving promise
                    const ranmincss = run(mincss, ['Minifying CSS files...', `${print.checkmark} CSS files in ${outDir} minified`]).then(toolbox.ext(outDir, "css"))
                    if (ranmincss) {
                        resolve(ranmincss)
                    } 
                } else {
                    resolve();
                }
            })
            return mincsspromise

        }
}