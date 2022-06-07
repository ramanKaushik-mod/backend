const { json } = require('express');
const main = require('./main.js')
const cm= require('./Creator.js');
const address = '0x12E2127C0195bb6E2839174BeDdf3eDCB1ccB4b5';

const voting = async (
    _pID,
    _cID,
    _vID
) => {
    return await main.init2().then(async (obj) => await obj.voting(
        _pID,
        _cID,
        _vID
    ).send({ from: address }))
}

const voteStatusOfPolls_Snapshot = async (
    _pollInfo
) => {
    return await main.init2().then(async (obj) => {
        pollsVoteStatus = []
        for (let i = 0; i < _pollInfo.length; i++) {
            let element = {}
            const pid = _pollInfo[i].pid
            const cids = _pollInfo[i].cids
            const pollData = await cm.getPoll(_pollInfo[i].pid)
            element.pid = pid
            element.cids = []
            element.poll = pollData
            for (let j = 0; j < cids.length; j++) {
                const status = await obj.candidateVoteCount(
                    pid,
                    cids[j].cID
                ).call()
                const curCid = cids[j].cID
                const name = cids[j].cName
                element.cids.push({ cid: curCid, name: name, status: status })
            }
            if (element.cids.length > 1) {
                pollsVoteStatus.push(element)
            }
        }
        return pollsVoteStatus
    })
}

module.exports = {
    voting: voting,
    vsps: voteStatusOfPolls_Snapshot
}