module.exports = toolbox => {
    toolbox.cmd = (cmd, args) => {
        const {
            PSCommand
        } = require('node-powershell');
        let command = new PSCommand(cmd).addArgument(args);
        return command;
    }
    toolbox.run = (cmd, [spinner, message]) => {
        const shell = require('node-powershell');
        const CLI = require('clui');
        const Spinner = CLI.Spinner;
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
            //const status = toolbox.print.spin(spinner || "Running")

            ps.invoke()
                .then(output => {
                    //status.succeed(message);
                    status.stop();
                    console.log(message);
                    resolve(true);
                    ps.dispose();
                })
                .catch(err => {
                    //status.fail("Process failed");
                    status.stop()
                    console.log(err);
                    ps.dispose();
                });
        })
        return promise
    }, toolbox.req = (requires) => {
        const requiresCmd = new Promise(
            (resolve, reject) => {
                if (requires) {
                    console.log("Requires " + requires)
                    resolve(true);
                } else {
                    console.log("No requirement")
                    reject(false);
                }

            }
        );
    }
}

