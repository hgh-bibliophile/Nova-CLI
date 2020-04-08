module.exports = {
  run: async () => {
    const perf = require('execution-time')() // Dev Test
    perf.start()
    const { program } = require('commander')
    const project = require('../package.json')
    const nova = program
    nova.ext = {}
    nova.version(project.version)
    nova
      .command('scss')
      .description('Compile .scss files')
      .option('-d, --dev', 'Run in dev mode.', false)
      .option('-p, --pro', 'Run in pro mode.', false)
      .action(async args => {
        require('./nova/scss.js')(nova)
        const { scssAll } = nova.ext
        await scssAll(args)
        const results = perf.stop()
        console.log(results.preciseWords)
      })
    nova.parse(process.argv)
  }
}
