module.exports = toolbox => {
    toolbox.opt = async (mode, rtrn) => {
        const { parameters } = toolbox
        let isArg = (param) => {
            let p = param.charAt(0)
            const opt = parameters.options[param]
            const o = parameters.options[p]
            const tf = opt ? true : o ? true : false
            return tf
        }
        const truthy = isArg(mode)

        //Specifically for when dev or pro are being queried about
        if (rtrn && (mode === "dev" || "pro")) {
            let nomode
            let notruthy
            let oppotruthy
            if (mode === "dev") {
                nomode = "pro"
                oppotruthy = isArg(nomode)
                if (truthy) {
                    notruthy = false
                } else if (oppotruthy){
                    notruthy = true
                } else {
                    notruthy = false
                }
            } else if (mode === "pro") {
                nomode  = "dev"
                oppotruthy = isArg(nomode)
                if (truthy) {
                    notruthy = false
                } else if (oppotruthy){
                    notruthy = true
                } else {
                    notruthy = false
                }
            } else {
                return truthy
            }
            let modi = { [mode]: truthy, [nomode]: notruthy}
            return modi
        }
        return truthy

    },
    toolbox.dev = () => {
        const { parameters } = toolbox
        let isArg = (param) => {
            let p = param.charAt(0)
            const opt = parameters.options[param]
            const o = parameters.options[p]
            const tf = opt ? true : o ? true : false
            return tf
        }
        const InDevMode = new Promise(
            (resolve, reject) => {
                if (isArg("dev")) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        )
        return InDevMode
    },
    toolbox.pro = () => {
        const { parameters } = toolbox
        let isArg = (param) => {
            let p = param.charAt(0)
            const opt = parameters.options[param]
            const o = parameters.options[p]
            const tf = opt ? true : o ? true : false
            return tf
        }
        const InProMode = new Promise(
            (resolve, reject) => {
                if (isArg("pro")) {
                    resolve(true);
                } else {
                    resolve(false);
                }

            }
        )
        return InProMode
    }
}

/*_ ES7 _/
const isMomHappy = true;

// Promise
const willIGetNewPhone = new Promise(
    (resolve, reject) => {
        if (isMomHappy) {
            const phone = {
                brand: 'Samsung',
                color: 'black'
            };
            resolve(phone);
        } else {
            const reason = new Error('mom is not happy');
            reject(reason);
        }

    }
);

// 2nd promise
async function showOff(phone) {
    return new Promise(
        (resolve, reject) => {
            var message = 'Hey friend, I have a new ' +
                phone.color + ' ' + phone.brand + ' phone';

            resolve(message);
        }
    );
};

// call our promise
async function askMom() {
    try {
        console.log('before asking Mom');

        let phone = await willIGetNewPhone;
        let message = await showOff(phone);

        console.log(message);
        console.log('after asking mom');
    }
    catch (error) {
        console.log(error.message);
    }
}

(async () => {
    await askMom();
})()*/