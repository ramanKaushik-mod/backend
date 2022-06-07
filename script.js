
const cMethods = require('./Creator.js')
const gMethods = require('./generator/generator.js')
const vMethods = require('./Voting.js')
const voterMethods = require('./Voter.js')
const gm = require('./gm.js')
const fs = require('fs')
const OK_STATUS = 200
const ALREADY_EXIST = 198
const ERROR = 404
const DOES_NOT_EXIST = 190
const WRONG_PASSCODE = 151


const express = require('express')
const app = express()
const PORT = 5000

const cors = require('cors')
const { json, response } = require('express')
const { profile } = require('console')

app.use(cors())
app.use(json({ limit: '10mb' }))

const p = (value) => console.log(value);

app.get('/check', (req, res) => {
    res.send({ res: OK_STATUS })
})

app.post('/reviews', (req, res) => {
    fields = req.body
    if (fields.type === 'POST') {
        fs.readFile('./reviews/reviews.json', 'utf-8', (err, data) => {
            if (err) {
                res.send({ res: ERROR })
            } else {
                try {
                    let dataArr = JSON.parse(data)
                    dataArr = dataArr.data
                    dataArr.unshift(fields.data)
                    const obj = JSON.stringify({ data: dataArr })
                    fs.writeFile('reviews/reviews.json', obj, (err) => {
                        if (err) {
                            res.send({ res: ERROR })
                        } else {
                            res.send({ res: OK_STATUS, data:dataArr})
                        }
                    })
                } catch (error) {
                    return res.send({ res: ERROR })
                }
            }
        })
    } else if (fields.type === 'GET') {
        fs.readFile('./reviews/reviews.json', 'utf-8', (err, data) => {
            if (err) {
                res.send({ res: ERROR })
            } else {
                try {
                    let dataArr = JSON.parse(data)
                    res.send({ res: OK_STATUS, data: dataArr.data })
                } catch (error) {
                    return res.send({ res: ERROR })
                }
            }
        })
    }
})

app.post('/creatorSignUp', async (req, res) => {
    fields = req.body
    var flag = await cMethods.checkCreator(
        fields._email
    )
    if (flag) {
        res.send({ res: ALREADY_EXIST })
    } else {
        cMethods.creatorSignUp(
            fields._password,
            fields._name,
            fields._email,
            fields._contact,
            `${gMethods.gUID()}`
        ).then((result) => {
            if (result.status) {
                res.send({ res: OK_STATUS })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })
    }
})

app.post('/creatorSignIn', async (req, res) => {
    fields = req.body
    var flag = await cMethods.checkCreator(
        fields._email
    )

    if (!flag) {
        res.send({ res: DOES_NOT_EXIST })
    } else {
        cMethods.creatorSignIn(
            fields._password,
            fields._email
        ).then((result) => {
            if (result.pCEmail.length === 0) {
                res.send({ res: WRONG_PASSCODE })
            } else {
                res.send({ res: OK_STATUS, body: result })
            }
        }).catch(() => {
            res.send({ res: ERROR })
        })
    }
})

app.post('/ucp', (req, res) => {
    fields = req.body
    cMethods.validateCreatorIDEmailforFP(
        fields._email,
        fields._id
    ).then((status) => {
        if (status) {
            cMethods.updateCPasscode(
                fields._email,
                fields._newPasscode
            ).then(() => {
                res.send({ res: OK_STATUS })
            }).catch((e) => {
                res.send({ res: ERROR })
            })
        } else {
            res.send({ res: DOES_NOT_EXIST })
        }
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/addPIDs', (req, res) => {
    fields = req.body

    _pid = gMethods.gPID()
    cMethods.pidExistance(
        _pid
    ).then((_newPID) => {
        cMethods.addPIDs(
            fields._email,
            _newPID,
            fields._createdate,
            fields._startdate,
            fields._enddate,
            fields._title
        ).then((txStatus) => {
            if (txStatus.status) {
                res.send({ res: OK_STATUS, pid: _newPID })
            } else {
                res.send({ res: ERROR })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })
    })
})
// for Ist element in body
app.post('/addCandidate', (req, res, next) => {
    fields = req.body

    if (fields.cArr.length == 2) {
        _cid = gMethods.gCID()
        cMethods.addCandidate(
            fields.cArr[0].pid,
            fields.cArr[0].candidateName,
            fields.cArr[0].candidateManifest,
            _cid
        ).then((txStatus) => {
            if (txStatus.status) {
                next()
            } else {
                res.send({ res: ERROR })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })
    } else {
        _cid = gMethods.gCID()
        cMethods.addCandidate(
            fields.cArr[0].pid,
            fields.cArr[0].candidateName,
            fields.cArr[0].candidateManifest,
            _cid
        ).then((txStatus) => {
            if (txStatus.status) {
                res.send({ res: OK_STATUS })
            } else {
                res.send({ res: ERROR })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })

    }

})
// for IInd element in body

app.post('/addCandidate', (req, res) => {
    fields = req.body
    _cid = gMethods.gCID()
    cMethods.addCandidate(
        fields.cArr[1].pid,
        fields.cArr[1].candidateName,
        fields.cArr[1].candidateManifest,
        _cid
    ).then((txStatus) => {
        if (txStatus.status) {
            res.send({ res: OK_STATUS })
        }
    }).catch(() => {
        res.send({ res: ERROR })
    })
})



app.post('/getPollDetails', (req, res) => {
    fields = req.body
    cMethods.checkCreator(
        fields._email
    ).then((result) => {
        if (!result) {
            res.send({ res: DOES_NOT_EXIST })
        } else {
            cMethods.getPollDetails(
                fields._email
            ).then((polls) => {
                res.send({ res: OK_STATUS, polls: polls })
            }).catch(() => {
                res.send({ res: ERROR })
            })
        }
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/voting', (req, res) => {
    fields = req.body
    vMethods.voting(
        fields._pid,
        fields._cid,
        fields._vid
    ).then((tx) => {
        if (tx.status) {
            res.send({ res: OK_STATUS })
        } else {
            res.send({ res: ERROR })
        }
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/voterSignUp', async (req, res) => {
    fields = req.body

    var flag = await voterMethods.checkVoter(
        fields._email   //_email is voter-id
    )

    if (flag) {
        res.send({ res: ALREADY_EXIST })
    } else {
        voterMethods.voterSignUp(
            fields._password,
            fields._name,
            `${fields._contact}`,
            fields._email,
            gMethods.gUID()
        ).then((result) => {
            if (result.status) {
                res.send({ res: OK_STATUS })
            } else {
                res.send({ res: ERROR })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })
    }
})

app.post('/voterSignIn', async (req, res) => {
    fields = req.body
    flag = await voterMethods.checkVoter(
        fields._email
    )
    if (!flag) {
        res.send({ res: DOES_NOT_EXIST })
    } else {
        voterMethods.voterSignIn(
            fields._password,
            fields._email
        ).then((result) => {
            if (result.voterId.length === 0) {
                res.send({ res: WRONG_PASSCODE })
            } else {
                res.send({ res: OK_STATUS, body: result })
            }
        }).catch((e) => {
            res.send({ res: ERROR })
        })
    }
})

app.post('/uvp', (req, res) => {
    fields = req.body
    voterMethods.validateVoterIDEmailforFP(
        fields._email,
        fields._id
    ).then((status) => {
        if (status) {
            voterMethods.updateVPasscode(
                fields._email,
                fields._newPasscode
            ).then(() => {
                res.send({ res: OK_STATUS })
            }).catch((e) => {
                res.send({ res: ERROR })
            })
        } else {
            res.send({ res: DOES_NOT_EXIST })
        }
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})



app.get('/cvs', (req, res) => {       // cvs -> checkVoteStatus of voter for a particular pollID
    fields = req.body
    voterMethods.checkVoteStatus(
        fields._email,
        fields._pid
    ).then((data) => {
        if (data) {
            res.send({ res: OK_STATUS, data: data })
        } else if (!data) {
            res.send({ res: OK_STATUS, data: data })
        } else {
            res.send({ res: ERROR })
        }

    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/vsps2', (req, res) => {
    fields = req.body
    vMethods.vsps(
        fields.pollInfo
    ).then((dataArr) => {
        res.send({ res: OK_STATUS, data: dataArr })
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})



// F R O M   V O T E R S

app.post('/gGPIDS', (req, res) => {
    gm.getGPIDS().then((dataArr) => {
        res.send({ res: OK_STATUS, data: dataArr })
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/gVPIDS', (req, res) => {
    fields = req.body
    voterMethods.getVPIDs(
        fields._email
    ).then((dataArr) => {
        res.send({ res: OK_STATUS, data: dataArr })
    }).catch((e) => {
        res.send({ res: ERROR })
    })
})

app.post('/addVPIDs', (req, res) => {
    fields = req.body
    gm.checkPid(
        fields._pid
    ).then((pidFlag) => {
        if (pidFlag == true) {
            voterMethods.checkPidInVIDs(
                fields._email,
                fields._pid
            ).then((vidFlag) => {
                if (vidFlag == true) {
                    res.send({ res: ALREADY_EXIST })
                } else {
                    voterMethods.addVIDs(
                        fields._email,
                        fields._pid
                    ).then((response) => {
                        if (response.status) {
                            res.send({ res: OK_STATUS })
                        } else {
                            res.send({ res: ERROR })
                        }
                    }).catch((e) => {
                        res.send({ res: ERROR })
                    })
                }
            })
        } else {
            res.send({ res: DOES_NOT_EXIST })
        }
    }).catch((e) => {
        p(e)
    })
})

app.post('/poll', (req, res) => {
    fields = req.body
    voterMethods.checkPidInVIDs(
        fields._vid,
        fields._pid
    ).then((status) => {
        if (!status) {
            cMethods.getPoll(
                fields._pid
            ).then((dataStruct) => {
                if (dataStruct[0] === '') {
                    res.send({ res: DOES_NOT_EXIST })
                } else {
                    cMethods.getPollCandidates(
                        fields._pid
                    ).then((dataArr) => {
                        res.send({ res: 200, data: { pollInfo: dataStruct, cArr: dataArr } })
                    }).catch((e) => {
                        res.send({ res: ERROR })
                    })

                }
            }).catch((e) => {
                res.send({ res: ERROR })
            })

        } else {
            res.send({ res: ALREADY_EXIST })
        }
    }).catch((e) => {
        res.send({ res: ERROR })

    })
})

app.post('/gpdfv', (req, res) => {
    fields = req.body
    gm.gpdfv(
        fields._pidArr,
        fields._email
    ).then((dataArr) => {
        res.send({ 'res': OK_STATUS, 'data': dataArr })
    }).catch((e) => {
        res.send({ res: ERROR, error_type: e })
    })
})


app.post('/up', (req, res) => {
    fields = req.body
    if (fields.type === 'POST') {
        const obj = JSON.stringify({ base64: fields.imageUrl })
        fs.writeFile(`./profiles/${fields.person}${fields.id}.json`, obj, err => {
            if (err) {
                res.send({ res: OK_STATUS, data: null })
            } else {
                res.send({ res: OK_STATUS, data: fields.imageUrl })
            }
        })
    } else if (fields.type === 'GET') {
        fs.readFile(`./profiles/${fields.person}${fields.id}.json`, 'utf-8', (err, data) => {
            if (err) {
                res.send({ res: OK_STATUS, data: null })
            } else {
                try {
                    let string = JSON.parse(data)
                    res.send({ res: OK_STATUS, data: string.base64 })
                } catch (error) {
                    res.send({ res: OK_STATUS, data: null })

                }
            }
        })
    }

})



app.listen(PORT, () => {
    p(`listening at PORT : ${PORT}`)
})

