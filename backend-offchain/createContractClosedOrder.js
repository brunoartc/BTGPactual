var web3 = require('./web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;

var address = '0x01ac4cB39d9545a351f92a01cC7d5db022e5AbaA';
var key = 'a557b20536ba8e2b55317b7e764ef46f0d9ef2b69150848bd5191d7281a5dddf';


function sendRaw(rawTx) {
    return new Promise(function(resolve, reject) {
        var privateKey = new Buffer(key, 'hex');
        var transaction = new tx(rawTx);
        transaction.sign(privateKey);
        console.log('Signing transaction with Ethereum contract creation [closed orders] with privateKey a557b20536ba8e2b55317b7e764ef46f0d9ef2b69150848bd5191d7281a5dddf from Ethereum adress 0x01ac4cB39d9545a351f92a01cC7d5db022e5AbaA'); 
        var serializedTx = transaction.serialize().toString('hex');
        web3.eth.sendRawTransaction(
        '0x' + serializedTx, function(err, result) {
            if(err) {
                console.log(err);
            } else {
              console.log('Transaction with contract [closed orders] created: '+ result)
              setTimeout(function () {
                waitBlock(function () {
                });
              }, 15000); 
                function waitBlock(callback) {
                    function innerWaitBlock() {
                      var receipt = web3.eth.getTransactionReceipt(result);
                      if (receipt && receipt.contractAddress) {
                        console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
                        console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
                        return resolve(receipt.contractAddress)
                      } else {
                        console.log("Waiting a mined block to include your contract [closed orders]... currently in block " + web3.eth.blockNumber);
                        setTimeout(innerWaitBlock, 4000);
                      }
                    }
                    innerWaitBlock();
                  }
            }
        });
    })
  }

module.exports = sendRaw;
