class MatchHashPool{
    constructor() {
    }
    getFiles(idPoolIPFS,pathIPFS){

        this._idPoolIPFS = idPoolIPFS;
        this._pathIPFS = pathIPFS;
        for(var key in this._pathIPFS) {
            this._HashIPFS = this._pathIPFS[key].hash;
        }
        this.generatePath();
    }
    generatePath(){
        const fs = require('fs');
        var path = [{_typeJSON: 'pathIPFSPool'},{_idPool:this._idPoolIPFS,_IPFSHash:this._HashIPFS}]
        var idPoolIPFS = this._idPoolIPFS;
        fs.writeFile(this._idPoolIPFS + '.json', JSON.stringify(path),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file ' + idPoolIPFS + '.json]: sucess')
        });
    };
};
module.exports = MatchHashPool;