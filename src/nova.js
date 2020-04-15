const { program } = require("commander")
const project = require("./config.js")
const {Signale} = require('signale')
const opt = {
	scope: 'Time'
}
const run = new Signale(opt)
const signale = new Signale()
run.config({
	displayFilename: false
})
const modeOpt = (args) => {
	args.dev = args.dev === undefined ? false : args.dev //TODO: create argVal function
	args.pro = args.pro === undefined ? false : args.pro
}
const fileOpt = (args) => {
	args.html = args.html === undefined ? false : args.html
	args.scss = args.scss === undefined ? false : args.scss
	args.js = args.js === undefined ? false : args.js
	args.all = args.all === undefined ? false : args.all
}
const log = err => {signale.error(err)}

module.exports = {
	run: async () => {
		run.time('Run')
  		const nova = program
		nova.ext = {}
		nova
			.helpOption("-H, --help", "Display help for command")
			.addHelpCommand("help [cmd]", "Display help for command")
			.version(
				"v" + project.version,
				"-V, --version",
				"Output the version number"
			)
			.description(project.description)
		nova.command("scss")
			.alias("s")
			.description("Compile .scss files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/scss.js")(nova)
				const { scssAll } = nova.ext
				modeOpt(args)
				await scssAll(args).catch(log)
				run.timeEnd('Run')
      		})
		nova.command("js")
			.alias("j")
			.description("Transpile .js files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/js.js")(nova)
				const { jsAll } = nova.ext
				modeOpt(args)
				await jsAll(args).catch(log)
				run.timeEnd('Run')
			})
		nova.command("img")
			.alias("i")
			.description("Optimize images")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/img.js")(nova)
				const { imgAll } = nova.ext
				modeOpt(args)
				await imgAll(args).catch(log)
				run.timeEnd('Run')
			})
		nova.command("prettify")
			.alias("p")
			.description("Prettify files in directory")
			.option("-h, --html", "Add .html files")
			.option("-s, --scss", "Add .scss files")
			.option("-j, --js", "Add .js files")
			.option("-a, --all", "Add all files")
			.action(async (args) => {
				require("./nova/prettier.js")(nova)
				const { prettify } = nova.ext
				fileOpt(args)
				await prettify(args).catch(log)
				run.timeEnd('Run')
			})
		nova.command("rename")
			.alias("r")
			.description("Rename files in directory")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/extensions/rename-extension.js")(nova, args)
				require("./nova/extensions/replace-extension.js")(nova, args)
				const { file, replace } = nova.ext
				const dir = require('./config.js')
				modeOpt(args)
				const rDir = args.pro ? dir.dist.root : dir.tmp.root
				await file(rDir).catch(log)
				//await replace().catch(log)
				run.timeEnd('Run')
			})
		nova.parse(process.argv)
	},
}
