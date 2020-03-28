
module.exports = {
    name: 'nova',
    alias: ['nova'],
    run: async (toolbox) => {
        const vorpal = require('vorpal')
        const program = vorpal()

        const dir = require('../config/pathVar.js')
        program.log('Welcome to the Nova CLI')
        program.ext = {}
        //SCSS Function
        program
            .command('scss', 'Compile .scss files')
            .option('-d, --dev', 'Run in dev mode.')
            .option('-p, --pro', 'Run in pro mode.')
            .action(async (args, cb) => {
              const argOpt = args.options
              require('../vorpal/scss.js')(program, toolbox)
                const { scssAll } = program.ext
                await scssAll(argOpt)
                cb()
            })
        program
            .delimiter('nova $')
            .show()
    },
  }
