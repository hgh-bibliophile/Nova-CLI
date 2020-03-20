module.exports = {
  name: 'oldnpcs',
  alias: ['o'],
  description: 'Welcome to npcs CLI',
  hidden: true,
  run: async (toolbox) => {
    const { print } = toolbox
    print.info('Welcome to the Node Project Compiler Scripts (npcs) CLI')
    print.info('Run --help or -h to get started!')
    //await toolbox.menu.showMenu();
  }
};