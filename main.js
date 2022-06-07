const Web3 = require('web3')

const Mark1 =  require('.\\build\\contracts\\Mark1.json');

const privateKey = '042ba8cc9699ef74be676a0ea9f5db2c4ad9d466f08065e45d3279a4c5a4b8b2'


const Provider = require('@truffle/hdwallet-provider');


const url = 'HTTP://127.0.0.1:9545'

const init2 = async () => {
    const provider = new Provider(privateKey, url)
    const web3 = new Web3(provider)
    const networkId = 5777
    const mark1 = new web3.eth.Contract(
        Mark1.abi,
        Mark1.networks[networkId].address
    )
        
    return await mark1.methods

}



module.exports = {
    init2: init2
 }