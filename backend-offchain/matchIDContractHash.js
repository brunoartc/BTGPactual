const admin = require("firebase-admin");

class MatchIDContractHash{
    constructor(){

    };
    matchIDContractHash(hash,ids){
        const fs = require('fs');

        const callSendHashContractIPFS = require('./control')
        callSendHashContractIPFS.sendHashIPFSEthContract(hash);

        if (fs.existsSync('dataHashContractID.json')) {
            var dataHashContract = JSON.parse(fs.readFileSync('dataHashContractID.json', 'utf8'));
            var newMatch = {_path:{ids,hash}};
            dataHashContract.push(newMatch);
            fs.writeFile('dataHashContractID.json', JSON.stringify(dataHashContract),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashContract.json with update]: sucess')
                var dataHashContractID = JSON.parse((fs.readFileSync('dataHashContractID.json','utf-8')))
                admin.database().ref('/ipfs/dataHashContractID').set({"dataHashContractID":dataHashContractID}) 
            });
        };
        if (!fs.existsSync('dataHashContractID.json')) {
            var data = [{_typeJSON:'matchIDCOntractHash'},{_path:{ids,hash}}]
            fs.writeFile('dataHashContractID.json', JSON.stringify(data),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashContract.json]: sucess')
                var dataHashContractID = JSON.parse((fs.readFileSync('dataHashContractID.json','utf-8')))
                admin.database().ref('/ipfs/dataHashContractID').set({"dataHashContractID":dataHashContractID}) 
            });
        };
    };
};


module.exports = MatchIDContractHash;