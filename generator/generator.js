
function generateCID() {
    let str = `${Math.floor(Math.random() * (10 ** 10))}`
    if (str.trim().length !== 10) {
        return generateCID()
    } else {
        return str;
    }

}

function generatePID() {
    let str = `${Math.floor(Math.random() * (10 ** 6))}`
    if (str.trim().length !== 6) {
        return generatePID()
    } else {
        return str;
    }
}

function generateUID() {
    let str = `${Math.floor(Math.random() * (10 ** 8))}`
    if (str.trim().length !== 8) {
        return generateUID()
    } else {
        return str;
    }
}



generatePID()

module.exports = {
    gCID: generateCID,
    gPID: generatePID,
    gUID: generateUID
}

