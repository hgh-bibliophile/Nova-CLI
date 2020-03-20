
module.exports = {
    name: 'npcs',
    alias: ['npcs'],
    run: async (toolbox) => {
        const vorpal = require('vorpal')
        const program = vorpal()
        const dir = require('../config/pathVar.js')
        toolbox.print.info('Welcome to the NPCS CLI')
        program
            .command('scss', 'Compile .scss files')
            .option('-d, --dev', 'Run in dev mode.')
            .option('-p, --pro', 'Run in pro mode.')
            .action(async (args) => {
                const scss = require('./scss.js')
                await scss.run(toolbox, args)
            })
        program
            .delimiter('npcs $')
            .show()
    },
  }



