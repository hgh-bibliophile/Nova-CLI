module.exports = {
  run: async () => {
    const vorpal = require('vorpal')
    const program = vorpal()
    const log = require('log-utils')
    const dir = require('./config/pathVar.js')
    const greet = log.heading(log.magenta(`Welcome to the Nova CLI`))
    console.log(greet)
    program.ext = {}
    //SCSS Function
    program
      .command('scss', 'Compile .scss files')
      .option('-d, --dev', 'Run in dev mode.')
      .option('-p, --pro', 'Run in pro mode.')
      .action(async (args, cb) => {
        const argOpt = args.options
        require('./vorpal/scss.js')(program)
        const {
          scssAll
        } = program.ext
        await scssAll(argOpt)
        cb()
      })
    program
      .delimiter('nova $')
      .show()

    //Program Inactivity Timeout
    const startCLItimeout = () => {
      return setTimeout(() => {
        process.kill(process.pid)
      }, 5000)
    }
    let endCLI = startCLItimeout()
    program.on('keypress', () => {
      clearTimeout(endCLI)
      endCLI = startCLItimeout()
    })
    program.on('client_prompt_submit', () => {
      clearTimeout(endCLI)
    })
    program.on('client_command_executed', () => {
      endCLI = startCLItimeout()
    })
  }
}