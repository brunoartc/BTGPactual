class MatchHashPool{
    constructor() {
    }
    getFiles(idPoolIPFS,pathIPFS,idsPoolIPFS){

        this._idPoolIPFS = idPoolIPFS;
        this._pathIPFS = pathIPFS;
        this._idsPoolIPFS = idsPoolIPFS;
        console.log(this._idsPoolIPFS);
        for(var key in this._pathIPFS) {
            this._HashIPFS = this._pathIPFS[key].hash;
        };
        this.generatePath();
    }
    generatePath(){

        const fs = require('fs');

        var dataPoolIPFS = JSON.parse(fs.readFileSync('poolIPFS.json', 'utf8'));
        var path = {_idPool:this._idPoolIPFS,_IPFSHash:this._HashIPFS,_idsPoolIPFS:this._idsPoolIPFS}
        dataPoolIPFS[1]["_pool"].push(path);

        fs.writeFile('poolIPFS.json', JSON.stringify(dataPoolIPFS),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolIPFS.json with update]: sucess')
        });
    };
};
module.exports = MatchHashPool;