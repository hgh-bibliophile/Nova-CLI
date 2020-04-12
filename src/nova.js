const perf = require("execution-time")() // Dev Test
const { program } = require("commander")
const project = require("./config/pathVar.js")
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
const logTime = () => {
	const results = perf.stop()
	console.log("Run Time: " + results.preciseWords)
}
module.exports = {
	run: async () => {
		perf.start()
		const nova = program
		nova.ext = {}
		nova.version()
		nova
			.helpOption("-H, --help", "Display help for command")
			.addHelpCommand("help [command]", "Display help for command")
			.version(
				"v" + project.version,
				"-V, --version",
				"Output the version number"
			)
			.description(project.description)
		nova
			.command("scss")
			.alias("s")
			.description("Compile .scss files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/scss.js")(nova)
				const { scssAll } = nova.ext
				modeOpt(args)
				await scssAll(args)
				logTime()
      })
    nova
			.command("js")
			.alias("j")
			.description("Transpile .js files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				require("./nova/js.js")(nova)
				const { jsAll } = nova.ext
				modeOpt(args)
				await jsAll(args)
				logTime()
			})
		nova
			.command("prettify")
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
				await prettify(args)
				logTime()
			})
		nova.parse(process.argv)
	},
}
