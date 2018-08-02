const web3 = require('./web3API');

const storehash = require('./storeHash');

class SendHashETH{
    constructor(){

    };

    async sendHash(){

        const accounts = await web3.eth.getAccounts();

        console.log('Sending from Metamask account: ' + accounts[0]);

        const ethAddress = await storehash.options.address;

        this._ethAddress = ethAddress;

        await storehash.methods.sendHash(this._ipfsHash).send({
            from: accounts[0] 
            }, (error, transactionHash) => {
              if (error){
                  throw error
              }
            console.log(transactionHash);
            this._transactionHash = transactionHash;
        });
    };

    async getEthReceipt(){

        try{
            this._blockNumber = "waiting..";
            this._gasUsed = "waiting...";

        await web3.eth.getTransactionReceipt(this._transactionHash, (err, txReceipt)=>{
              console.log(err,txReceipt);
              this._txReceipt = txReceipt;
            });
        }
        catch(error){
            console.log(error);
        }
    };
};

const runETH = new SendHashETH();

runETH.sendHash()