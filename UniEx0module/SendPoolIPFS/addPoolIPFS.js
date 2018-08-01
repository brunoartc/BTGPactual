const fs = require('fs');

const ipfs = require('./ipfsAPI');


class AddPoolIPFS{
    constructor(namepool){

        this.readPool(namepool);
        this.addPool();
        this._newData = null;

    };
    readPool(namepool){

        var dataPool = JSON.parse(fs.readFileSync(namepool + '.json'));
        this._newPoolIPFSID = dataPool[1]["_idPool"]
        var poolBuffer = Buffer.from(JSON.stringify(dataPool));
        this._newPoolIPFS = poolBuffer;
        console.log(this._newPoolIPFS);

    };
    addPool(){

        var newPoolIPFS = this._newPoolIPFS;

        var newPoolIPFSID = this._newPoolIPFSID;

        function addIPFS(pass){
            ipfs.files.add(newPoolIPFS, function(err, file){
                if (err){
                    throw err;
                };
                pass(err, file);
            });
        };
        
        addIPFS(function(err, res){
            const matchHashPool = require('./matchHashPool');
            const newMatchHashPool = new matchHashPool();
            newMatchHashPool.getFiles(newPoolIPFSID,res);

        });
    };
};

module.exports = AddPoolIPFS;