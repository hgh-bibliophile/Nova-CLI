module.exports = {
  run: async () => {
    const perf = require('execution-time')() // Dev Test
    perf.start()
    const logTime = () => {
      const results = perf.stop()
      console.log("Run Time: "+results.preciseWords)
    }
    const { program } = require('commander')
    const project = require('../package.json')
    const nova = program
    nova.ext = {}
    nova.version()
    nova
      .helpOption('-H, --help', 'Display help for command')
      .addHelpCommand('help [command]', 'Display help for command')
      .version("v" + project.version, '-V, --version', 'Output the version number')
      .description(project.description)
    nova
      .command('scss')
      .alias('s')
      .description('Compile .scss files')
      .option('-d, --dev', 'Run in dev mode.', false)
      .option('-p, --pro', 'Run in pro mode.', false)
      .action(async args => {
        require('./nova/scss.js')(nova)
        const { scssAll } = nova.ext
        await scssAll(args)
        logTime()
      })
    nova
      .command('prettify <dir> [file types]')// Or 'prettier', 'pretty'
      .alias('p')
      .description('Prettify files in directory')
      .option('-h, --html', 'Add .html files')
      .option('-c, --css', 'Add .css files')
      .option('-s, --scss', 'Add .scss files')
      .option('-j, --js', 'Add .js files')
      .option('-a, --all', 'Add all files')
      .action(async (dir, options) => {
        /*require('./nova/prettier.js')(nova)
        const { prettify } = nova.ext
        await prettify(args)*/
        console.log(dir)
        console.log(options.html)
        logTime()
      })
    nova.parse(process.argv)
  }
}
