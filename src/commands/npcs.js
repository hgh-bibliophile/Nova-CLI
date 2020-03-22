
module.exports = {
    name: 'npcs',
    alias: ['npcs'],
    run: async (toolbox) => {
        const vorpal = require('vorpal')
        const program = vorpal()
        const dir = require('../config/pathVar.js')
        program.log('Welcome to the NPCS CLI')
        program.ext = {}
        //SCSS Function
        program
            .command('scss', 'Compile .scss files')
            .option('-d, --dev', 'Run in dev mode.')
            .option('-p, --pro', 'Run in pro mode.')
            .action(async (args, cb) => {
              require('../vorpal/scss.js')(program, toolbox)
                const { scssAll } = program.ext
                await scssAll(args)
                cb()
            })
        program
            .delimiter('npcs $')
            .show()
    },
  }
