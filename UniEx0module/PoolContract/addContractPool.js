var fs = require('fs');

class AddContract{
    constructor(idContract){

        this.readContractID(idContract);
        this.addContract();

    };
    readContractID(idContract){

        var dataContract = JSON.parse(fs.readFileSync(idContract + '.json', 'utf8'));
        this._newContract = dataContract[1];

    };
    addContract(){

        var dataPoolContract = JSON.parse(fs.readFileSync('poolContract.json', 'utf8'));
        dataPoolContract[1]["_contract"].push(this._newContract);
        fs.writeFile('poolContract.json', JSON.stringify(dataPoolContract),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolContract.json with update]: sucess')
        });
    };
};

module.exports = AddContract;