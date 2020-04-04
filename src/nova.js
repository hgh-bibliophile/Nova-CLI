module.exports = {
  run: async () => {
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
      })
    nova.parse(process.argv)
  }
}
