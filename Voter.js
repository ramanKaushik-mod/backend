const main = require('./main.js')

const address = '0x12E2127C0195bb6E2839174BeDdf3eDCB1ccB4b5';

const addVoter = async (
    _password,
    _voterName,
    _voterContactNo,
    _email,
    _id
) => {
    return await main.init2().then(async (obj) => await obj.addVoter(
        _password,
        _voterName,
        _voterContactNo,
        _email,
        _id
    ).send({ from: address }))
}


const getVoter = async (
    _password,
    _email
) => {
    return await main.init2().then(async (obj) => await obj.voters(
        _email,
        _password
    ).call())
}

const addVIDs = async (
    _email,
    _pID
) => {
    return await main.init2().then(async (obj) => await obj.addVIDs(
        _email,
        _pID
    ).send({ from: address }))
}

const updateVoteStatusOfVoter = async (
    _vid,
    _pid
) => {
    return await main.init2().then(async (obj) => await obj.updateVoteStatusOfVoter(
        _vid,
        _pid
    ).send({ from: address }))
}

const checkVoter = async (
    _email
) => {
    return await main.init2().then(async (obj) => await obj.vEmails(
        _email
    ).call())
}

const validateVoterIDEmailforFP = async (
    _email,
    _id
) => {
    return await main.init2().then(async (obj) => await obj.validateVoter(
        _email,
        _id
    ).call())
}

const updateVPasscode = async (
    _email,
    _newPasscode
) => {
    return await main.init2().then(async (obj) => await obj.updateVPasscode(
        _email,
        _newPasscode
    ).send({ from: address }))
}

const checkVoteStatus = async (
    _email,
    _pid
) => {
    return await main.init2().then(async (obj) => await obj.checkVoteStatus(
        _email,
        _pid
    ).call())
}

const getVPIDs = async (
    _voterId
) => {
    return await main.init2().then(async (obj) => await obj.getVPIDs(
        _voterId
    ).call())
}

const checkPidInVIDs = async (
    _voterId,
    _pid
) => {
    return await main.init2().then(async (obj) => await obj.checkPidInVIDs(
        _voterId,
        _pid
    ).call())
}


module.exports = {
    voterSignUp: addVoter,
    voterSignIn: getVoter,
    addVIDs: addVIDs,
    uVS: updateVoteStatusOfVoter,
    checkVoter: checkVoter,
    updateVPasscode: updateVPasscode,
    checkVoteStatus: checkVoteStatus,
    getVPIDs: getVPIDs,
    checkPidInVIDs: checkPidInVIDs,
    validateVoterIDEmailforFP: validateVoterIDEmailforFP
}