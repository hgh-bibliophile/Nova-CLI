module.exports = toolbox => {
    toolbox.arg = async (arg) => {
        a = arg.charAt(0)
        const { parameters } = toolbox
        let truthy
        for (var i = 0; i < parameters.argv.length; i++) {
        const par = parameters.array[i] === arg ? true : false
        const p = parameters.array[i] === a ? true : false
        const raw = parameters.argv[i] === arg ? true : false
        const r = parameters.argv[i] === a ? true : false
        truthy = par ? true : p ? true : raw ? true : r ? true : false
        if (truthy) {
            return truthy
        }
        }
        return truthy

    }
}