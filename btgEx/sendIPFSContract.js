const ipfs = require('./ipfsAPI')

class SendIPFSContract{
    constructor(contract){

        this._contract = contract;
        this._contractID = [];

    };
    getID(){

        for (var i in this._contract){
            this._contractID.push(this._contract[i].id)
        };
        this.sendContract()
    };
    sendContract(){

        this._contractBuffer = Buffer.from(JSON.stringify(this._contract));

        var ids = this._contractID;

        ipfs.files.add(this._contractBuffer, function(err,files){
            if (err){
                throw err
            }
            const matchIDContractHash = require('./matchIDContractHash')
            const newMatchIDContractHash = new matchIDContractHash();
            newMatchIDContractHash.matchIDContractHash(files[0].hash,ids)
        });
    };
};

module.exports = SendIPFSContract;