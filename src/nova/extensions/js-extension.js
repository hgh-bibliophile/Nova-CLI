module.exports = nova => {
  nova.ext.js = (outputDir, args) => {
    //require('./pwrshell-extension')(nova)
    const { cmd, run } = nova.ext
    const dir = require('../../config/pathVar.js')
    var jspromise = new Promise(function(resolve) {
      const srcmps = args.dev
        ? `--source-map`
        : args.pro
        ? `--no-source-map`
        : `--source-map`
      const scss = cmd('sass', `${srcmps} ${dir.src.styles}:${outputDir}`)
      const ranscss = run(scss, [
        'Compiling SCSS files...',
        `SCSS files compiled to ${outputDir}`
      ])
      if (ranscss) {
        resolve(ranscss)
      }
    })
    return jspromise
  }
}
