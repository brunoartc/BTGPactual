const web3 = require('./web3API');

const storehash = require('./storeHash');

const ipfs = require('./ipfsAPI');


class SendHashETH{
    constructor(){

        this.onSubmit();
        this.onClick();
    }

    async onClick(){
        try{
                this._blockNumber = "waiting..";
                this._gasUsed = "waiting...";
        //get Transaction Receipt in console on click
        //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        await web3.eth.getTransactionReceipt(this._transactionHash, (err, txReceipt)=>{
                  console.log(err,txReceipt);
                  this._txReceipt = txReceipt;
                }); //await for getTransactionReceipt
        // await this.setState({blockNumber: this.state.txReceipt.blockNumber});
                // await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
              } //try
            catch(error){
                console.log(error);
              } //catch
          } //onClick
    async onSubmit(){
             //bring in user's metamask account address
              const accounts = await web3.eth.getAccounts();
             
              console.log('Sending from Metamask account: ' + accounts[0]);
            //obtain contract address from storehash.js
              const ethAddress= await storehash.options.address;
              this._ethAddress = ethAddress;
              var buffer = new Buffer([ 8, 6, 7, 5, 3, 0, 9]);
            //save document to IPFS,return its hash#, and set hash# to state
            //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
              await ipfs.add(buffer, (err, ipfsHash) => {
                console.log(err,ipfsHash);
                //setState by setting ipfsHash to ipfsHash[0].hash 
                this._ipfsHash = ipfsHash[0].hash; 
           // call Ethereum contract method "sendHash" and .send IPFS hash to etheruem contract 
          //return the transaction hash from the ethereum contract
         //see, this https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#methods-mymethod-send
                
                storehash.methods.sendHash(this._ipfsHash).send({
                  from: accounts[0] 
                }, (error, transactionHash) => {
                  console.log(transactionHash);
                  this._transactionHash = transactionHash;
                }); //storehash 
              }) //await ipfs.add 
            }; //onSubmit    
};

const runSend = new SendHashETH();