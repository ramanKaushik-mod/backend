const main = require('./main.js')

const cm = require('./Creator')

const address = '0x12E2127C0195bb6E2839174BeDdf3eDCB1ccB4b5';


// will return an array of pids

const getGPIDS = async () => {
    return await main.init2().then(async (obj) => await obj.getGPIDS().call())
}


const checkPid = async (
    _pid
) => {
    return await main.init2().then(async (obj) => await obj.checkPid(
        _pid
    ).call())
}


const getPollDetailsForVoter = async (
    pidArr,
    voterId
) => {
    return await main.init2().then(async (obj) => {
        let mainObj = []
        for (let i = 0; i < pidArr.length; i++) {
            let pollInfo = await cm.getPoll(pidArr[i])
            let cArr = await cm.getPollCandidates(pidArr[i])
            let vsov = await obj.vote(
                voterId,
                pidArr[i]
            ).call()
            for (let j = 0; j < cArr.length; j++) {
                cArr[j].voteCount = await obj.candidateVoteCount(
                    pidArr[i],
                    cArr[j].cID
                ).call()
            }
            mainObj.push({
                'pollInfo': pollInfo,
                'cArr': cArr,
                'vsov':vsov
            })
        }
        return mainObj
    })
}









module.exports = {
    getGPIDS: getGPIDS,
    checkPid: checkPid,
    gpdfv:getPollDetailsForVoter
}