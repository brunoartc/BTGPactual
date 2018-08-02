const web3 = require('./web3API');

const storehash = require('./storeHash');


class SendHashETH{
    constructor(){

        this.onSubmit();
        this.onClick();
    }

    onClick(){
        try{
                this._blocknumber = "waiting..";
                this._gasused = "waiting...";
        //get Transaction Receipt in console on click
        //See: https://web3js.readthedocs.io/en/1.0/web3-eth.html#gettransactionreceipt
        web3.eth.getTransactionReceipt(this._transactionHash, (err, txReceipt)=>{
                  console.log(err,txReceipt);
                  this._txReceipt = txReceipt;
                }); //await for getTransactionReceipt
        // await this.setState({blockNumber: this.state.txReceipt.blockNumber});
                // await this.setState({gasUsed: this.state.txReceipt.gasUsed});    
              } //try
            catch(err){
                console.log(err);
              } //catch
          } //onClick

    onSubmit(event){
        event.preventDefault();
        //bring in user's metamask account address
        const accounts = web3.eth.getAccounts();
             
            console.log('Sending from Metamask account: ' + accounts[0]);
        //obtain contract address from storehash.js
            const ethAddress= storehash.options.address;
            this._ethadress = ethAddress;
        //save document to IPFS,return its hash#, and set hash# to state
        //https://github.com/ipfs/interface-ipfs-core/blob/master/SPEC/FILES.md#add 
            storehash.methods.sendHash('this._ipfsHash').send({
                from: accounts[0] 
            }, (err, transactionHash) => {
                if(err){
                    throw err
                }
                console.log(transactionHash);
                this._transactionHash = transactionHash;
            }); //storehash  
        }; //onSubmit         
};

const runSend = new SendHashETH();