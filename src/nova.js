

module.exports = {
  run: async () => {
    const perf = require('execution-time')() // Dev Test
    perf.start()
    //Functions
    const logTime = () => {
      const results = perf.stop()
      console.log("Run Time: "+results.preciseWords)
    }
    const argVal = (opt) => {
      opt = opt === undefined ? false : opt
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
      .option('-d, --dev', 'Run in dev mode.')
      .option('-p, --pro', 'Run in pro mode.')
      .action(async args => {
        require('./nova/scss.js')(nova)
        const { scssAll } = nova.ext
        await scssAll(args)
        logTime()
      })// Or 'prettier', 'pretty'
    nova
      .command('prettify <dir>')
      .alias('p')
      .description('Prettify files in directory')
      .option('-h, --html', 'Add .html files')
      .option('-c, --css', 'Add .css files')
      .option('-s, --scss', 'Add .scss files')
      .option('-j, --js', 'Add .js files')
      .option('-a, --all', 'Add all files')
      .action(async (dir, args) => {
        /*require('./nova/prettier.js')(nova)
        const { prettify } = nova.ext
        await prettify(args)*/
        args.html = args.html === undefined ? false : args.html
        args.scss = args.scss === undefined ? false : args.scss
        args.css = args.css === undefined ? false : args.css
        args.js = args.js === undefined ? false : args.js
        args.all = args.all === undefined ? false : args.all
        console.log(args.opts())
        console.log(args.html)
        logTime()
      })
    nova.parse(process.argv)
  }
}
