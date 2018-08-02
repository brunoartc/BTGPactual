const fs = require('fs');

const ipfs = require('./ipfsAPI');


class AddPoolIPFS{
    constructor(namepool){

        this.readPool(namepool);
        this.addPool();
        
    };
    readPool(namepool){

        var dataPool = JSON.parse(fs.readFileSync(namepool + '.json'));

        this._newPoolIPFSIDs = [];

        if (namepool == 'poolContract'){
            for (var i in dataPool[1]["_contract"]){
                this._newPoolIPFSIDs.push(dataPool[1]["_contract"][i]["_id"]);
            };
        };
        if (namepool == 'poolClosedOrder'){
            for (var i in dataPool[1]["_closedOrder"]){
                this._newPoolIPFSIDs.push(dataPool[1]["_closedOrder"][i]["_id"]);
            };
        };

        this._newPoolIPFSID = dataPool[1]["_idPool"]
        var poolBuffer = Buffer.from(JSON.stringify(dataPool));
        this._newPoolIPFS = poolBuffer;
        console.log(this._newPoolIPFS);

    };
    addPool(){

        var newPoolIPFS = this._newPoolIPFS;

        var newPoolIPFSID = this._newPoolIPFSID;

        var newPoolIPFSIDs = this._newPoolIPFSIDs;

        function addIPFS(pass){
            ipfs.files.add(newPoolIPFS, function(err, file){
                if (err){
                    throw err;
                };
                pass(err, file);
            });
        };
        
        addIPFS(function(err, res){
            if (err){
                throw err
            }
            const matchHashPool = require('./matchHashPool');
            const newMatchHashPool = new matchHashPool();
            newMatchHashPool.getFiles(newPoolIPFSID,res,newPoolIPFSIDs);

        });
    };
};

module.exports = AddPoolIPFS;