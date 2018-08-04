var Web3 = require('web3');

var web3 = new Web3(
    new Web3.providers.HttpProvider('https://rinkeby.infura.io/')
);

module.exports = web3;