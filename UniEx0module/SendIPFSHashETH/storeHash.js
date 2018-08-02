const web3 = require('./web3API')
//access our local copy to contract deployed on rinkeby testnet
//use your own contract address
const address = '0xc0ebcbd4e2eaa17c12d1c0bc57bd3a9dfe1c8a4c';
//use the ABI from your contract
const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "name": "sendHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getHash",
    "outputs": [
      {
        "name": "x",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
module.exports =  new web3.eth.Contract(abi, address);