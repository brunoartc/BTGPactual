class CreatePoolContractJSON{
    constructor(){

    };
    generatePoolContractJSON(){
        const fs = require('fs');
        var contract = [{_typeJSON: 'poolContract'},{_idPool:'123ABC',_contract:[]}]
        fs.writeFile('poolContract.json', JSON.stringify(contract),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolContract.json]: sucess')
        });
    };
};

module.exports = CreatePoolContractJSON;