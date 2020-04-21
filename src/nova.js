const {program} = require("commander")
const project = require("./config.js")
const path = require('path')
const fs = require('fs-extra')
const stack = require('stack-utils')
const nova = program

nova.ext = {}
nova.listr = {}
nova.trace = new stack()

let n = {
	loggers: async () => {
		const {Signale} = require('signale')
		const optSignale = {types: {success: {label: 'Success'}}}
		const optDebug = {scope: 'Debug'}
		const config = {
			displayBadge: false,
			underlineLabel: false,
			displayFilename: false
		}
		n.signale = new Signale(optSignale)
		n.debug = new Signale(optDebug)
		n.debug.disable()
		n.run = n.debug.scope('Time')
		n.run.config(config)
		n.signale.config(config)
		n.debug.config({
			displayBadge: false,
			underlineLabel: false,
			displayFilename: true
		})
		n.debuger = (dValue, previous) => {
			n.debug.enable()
			n.run.enable()
			return previous
		}
	},
	log: (err) => {n.signale.error(err)},
	setup: async (args, reqr = true) => {
		await Object.entries(args.opts()).forEach(
			(([key])=> args[key] = args[key] === undefined ? false : args[key])
		)
		return new Promise(async (resolve,reject) => {
			if (!reqr) return resolve(true)
			fullPath = await path.join(__dirname, 'nova', 'commands', args._name + '.js')
			reqrPath = await path.relative(__dirname, fullPath)
			try {
				if (!project.exe) exists = await fs.pathExists(fullPath)
				if (exists) {
					require('./' + reqrPath)(nova, args, n.signale, n.debug)
				} else {
					require('./require.js')
				}
				return resolve(nova.ext)
			} catch (error) {
				return reject(new Error("Required files weren't found"))
			}
		})
	}
}
module.exports = {
	run: async () => {
		await n.loggers()
		nova
			.helpOption("-H, --help", "Display help for command")
			.addHelpCommand("help [cmd]", "Display help for command")
			.version(
				"v" + project.version,
				"-V, --version",
				"Output the version number"
			)
			.description(project.description)
			.option("-D, --debug", "Enable debugging output.", n.debuger)
		
		nova.command("scss")
			.alias("s")
			.description("Compile .scss files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				try {
					const scss = await n.setup(args)
					await scss.scssAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
      		})
		nova.command("js")
			.alias("j")
			.description("Transpile .js files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				try {
					const js = await n.setup(args)
					await js.jsAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.command("html")
			.alias("h")
			.description("Optimize .html files")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				try {
					const html = await n.setup(args)
					await html.htmlAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.command("img")
			.alias("i")
			.description("Optimize images")
			.option("-d, --dev", "Run in dev mode.")
			.option("-p, --pro", "Run in pro mode.")
			.action(async (args) => {
				try {
					const img = await n.setup(args)
					await img.imgAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.command("prettify")
			.alias("p")
			.description("Prettify files in directory")
			.option("-h, --html", "Add .html files")
			.option("-s, --scss", "Add .scss files")
			.option("-j, --js", "Add .js files")
			.action(async (args) => {
				try {
					const prettify = await n.setup(args)
					await prettify.prettifyAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.command("all")
			.alias("a")
			.description("Run all commands")
			.option("-d, --dev", "Run all in dev mode.")
			.option("-p, --pro", "Run all in pro mode.")
			.action(async (args) => {
				try {
					const all = await n.setup(args)
					await all.runAll()
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.command("test")
			.alias("t")
			.description("Test commands")
			.option("-d, --dev", "Test in dev mode")
			.option("-p, --pro", "Test in pro mode")
			.action(async (args) => {
				try {
					n.signale.info(project.config)
				} catch (err) {
					n.log(err)
				}
				n.run.timeEnd('Run')
			})
		nova.parse(process.argv)
		n.run.time('Run')
	}
}
