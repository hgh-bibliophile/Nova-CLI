module.exports = (nova) => {//TODO: Switch to execa & listr
    nova.ext.cmd = (cmd, args) => {
        const {
            PSCommand
        } = require('node-powershell');
        let command = new PSCommand(cmd).addArgument(args);
        return command;
    }
    nova.ext.run = (cmd, [spinner, message]) => {
        const shell = require('node-powershell');
        const CLI = require('clui');
        const Spinner = CLI.Spinner;
        const log = require('log-utils');
        let ps = new shell({
            verbose: false,
            executionPolicy: 'Bypass',
            noProfile: true
        });
        if (cmd.constructor == Array) {
            for (let i = 0; i < cmd.length; i++) {
                ps.addCommand(cmd[i]);
            }
        } else {
            ps.addCommand(cmd);
        }
        const status = new Spinner(spinner || "Running");

        // Promise
        var promise = new Promise(function(resolve) {
            status.start();
            ps.invoke()
                .then(output => {
                    status.stop();
                    console.log(`${log.success} ${message}`);
                    resolve(true);
                    ps.dispose();
                })
                .catch(err => {
                    status.stop()
                    nova.log(err);
                    ps.dispose();
                });
        })
        return promise
    }
}

