const main = require('./main.js')
const gMethods = require('./generator/generator.js')

const address = '0x12E2127C0195bb6E2839174BeDdf3eDCB1ccB4b5';

const creatorSignUp = async (
    _password,
    _name,
    _email,
    _contact,
    _id
) => {
    return await main.init2().then(async (obj) => await obj.addCreator(
        _password,
        _name,
        _email,
        _contact,
        _id
    ).send({ from: address }))
}
const creatorSignIn = async (
    _password,
    _email
) => {
    return await main.init2().then(async (obj) => await obj.creators(
        _email,
        _password
    ).call())
}

const addPIDs = async (
    _email,
    _pID,
    createdAt,
    startdate,
    enddate,
    title
) => {
    return await main.init2().then(async (obj) => await obj.addPIDs(
        _email,
        _pID,
        createdAt,
        startdate,
        enddate,
        title
    ).send({ from: address }))
}

const getPoll = async (
    _pID
) => {
    return await main.init2().then(async (obj) => await obj.pollData(
        _pID
    ).call())
}

const addCandidate = async (
    _pID,
    _name,
    _manifesto,
    _cID
) => {
    return await main.init2().then(async (obj) => await obj.addCandidate(
        _pID,
        _name,
        _manifesto,
        _cID
    ).send({ from: address }))
}

const getPollDetails = async (
    _email
) => {

    return await main.init2().then(async (obj) => {
        let pLength = await obj.getpIDsLength(_email).call()
        let pLimit = pLength < 6 ? 0 : pLength - 6
        let pIDsTLE = []
        for (let index = pLength - 1; index >= pLimit; index--) {
            const element = await obj.pIDs(_email, index).call()
            pIDsTLE.push(element)
        }
        let allPolls = []

        for (let index = 0; index < pIDsTLE.length; index++) {
            let poll = await getPoll(pIDsTLE[index])
            let cArr = []
            const limit = await obj.getCLength(pIDsTLE[index]).call()
            for (let i = 0; i < limit; i++) {
                const element = await obj.candidates(pIDsTLE[index], i).call()
                cArr.push(element)
            }
            poll['candidates'] = cArr
            allPolls.push(poll)
        }
        return allPolls
    })
}

const checkCreator = async (
    _email
) => {
    return await main.init2().then(async (obj) => await obj.pCEmails(
        _email
    ).call())
}

const pidExistance = async (
    _pid
) => {
    await main.init2().then(async (obj) => {
        let limit = await obj.getGPIDsLength().call()
        for (i = 0; i < limit; i++) {
            element = await obj.gPIDs(i).call()
            if (element == _pid) {
                _pid = gMethods.gPID()
                i = 0
            }
        }
    })
    return await _pid
}

const validateCreatorIDEmailforFP = async (
    _email,
    _id
) => {
    return await main.init2().then(async (obj) => await obj.validateCreator(
        _email,
        _id
    ).call())
}

const updateCPasscode = async (
    _email,
    _newPasscode
) => {
    return await main.init2().then(async (obj) => await obj.updateCPasscode(
        _email,
        _newPasscode
    ).send({ from: address }))
}

const getPollCandidates = async (
    _pid
) => {
    return await main.init2().then(async (obj) => {
        const limit = await obj.getCLength(_pid).call()
        let cArr = []
        for (let i = 0; i < limit; i++) {
            let element = await obj.candidates(
                _pid,
                i
            ).call()

            cArr.push(element)
        }
        return cArr
    })
}

module.exports = {
    creatorSignUp: creatorSignUp,
    creatorSignIn: creatorSignIn,
    addPIDs: addPIDs,
    addCandidate: addCandidate,
    getPollDetails: getPollDetails,
    checkCreator: checkCreator,
    updateCPasscode: updateCPasscode,
    getPoll: getPoll,
    pidExistance: pidExistance,
    getPollCandidates: getPollCandidates,
    validateCreatorIDEmailforFP: validateCreatorIDEmailforFP
}