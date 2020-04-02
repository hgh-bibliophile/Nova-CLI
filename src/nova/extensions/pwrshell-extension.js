module.exports = (nova) => {//IDEA: Switch to execa?
    nova.ext.cmd = (cmd, args) => {
        const {
            PSCommand
        } = require('node-powershell');
        let command = new PSCommand(cmd).addArgument(args);
        return command;
    }
    nova.ext.run = (cmd, [spinner, message]) => {
        const shell = require('node-powershell');
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
        // Promise
        var promise = new Promise(function(resolve) {
            ps.invoke()
                .then(output => {
                    resolve(true);
                    ps.dispose();
                })
                .catch(err => {
                    console.log(err);
                    ps.dispose();
                });
        })
        return promise
    }
}

