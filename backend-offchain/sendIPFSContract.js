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

        const fs = require('fs')
        
        var ids = this._contractID;

        this._contractArray = [this._contract]

        if (fs.existsSync('dataHashContractID.json')) {

            var dataHashContractID = JSON.parse((fs.readFileSync('dataHashContractID.json','utf-8')));
            var dataHashContractIDReverse = dataHashContractID.reverse();
            var dataHashContractLastHash = dataHashContractIDReverse[0]._path.hash;
            this._contractArray.push({_lastHash:dataHashContractLastHash})

        };

        this._contractBuffer = Buffer.from(JSON.stringify(this._contractArray));

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