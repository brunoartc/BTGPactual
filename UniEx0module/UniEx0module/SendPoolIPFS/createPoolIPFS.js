class CreatePoolIPFSJSON{
    constructor(){

    };
    generatePoolIPFSJSON(){
        const fs = require('fs');
        var ipfs = [{_typeJSON: 'poolIPFS'},{_pool:[]}]
        fs.writeFile('poolIPFS.json', JSON.stringify(ipfs),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolIPFS.json]: sucess')
        });
    };
};

module.exports = CreatePoolIPFSJSON;