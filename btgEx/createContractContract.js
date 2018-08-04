var web3 = require('./web3');
var util = require('ethereumjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var txutils = lightwallet.txutils;

var address = '0x23b0c08603e42eBC38D395dbE6E6E834f8Cd67F6';
var key = '545f780fec7a2702724f4a5499c2045f2c97ad54d3a051f8994044b2d4196835';


function sendRaw(rawTx) {
    return new Promise(function(resolve, reject) {
        var privateKey = new Buffer(key, 'hex');
        var transaction = new tx(rawTx);
        transaction.sign(privateKey);
        var serializedTx = transaction.serialize().toString('hex');
        web3.eth.sendRawTransaction(
        '0x' + serializedTx, function(err, result) {
            if(err) {
                console.log(err);
            } else {
                console.log(result)
                function waitBlock(callback) {
                    function innerWaitBlock() {
                      var receipt = web3.eth.getTransactionReceipt(result);
                      if (receipt && receipt.contractAddress) {
                        console.log("Your contract has been deployed at http://testnet.etherscan.io/address/" + receipt.contractAddress);
                        console.log("Note that it might take 30 - 90 sceonds for the block to propagate befor it's visible in etherscan.io");
                        return resolve(receipt.contractAddress)
                      } else {
                        console.log("Waiting a mined block to include your contract... currently in block " + web3.eth.blockNumber);
                        setTimeout(innerWaitBlock, 4000);
                      }
                    }
                    innerWaitBlock();
                  }
                  
                  waitBlock(function () {
                });
            }
        });
    })
  }

module.exports = sendRaw;







