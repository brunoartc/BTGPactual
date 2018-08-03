class MatchIDContractHash{
    constructor(){

    };
    matchIDContractHash(hash,ids){
        const fs = require('fs');

        if (fs.existsSync('dataHashContractID.json')) {
            var dataHashContract = JSON.parse(fs.readFileSync('dataHashContractID.json', 'utf8'));
            var newMatch = {_path:{ids,hash}};
            dataHashContract.push(newMatch);
            fs.writeFile('dataHashContractID.json', JSON.stringify(dataHashContract),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashContract.json with update]: sucess')
            });
        };
        if (!fs.existsSync('dataHashContractID.json')) {
            var data = [{_typeJSON:'matchIDCOntractHash'},{_path:{ids,hash}}]
            fs.writeFile('dataHashContractID.json', JSON.stringify(data),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashContract.json]: sucess')
            });
        };
    };
};


module.exports = MatchIDContractHash;