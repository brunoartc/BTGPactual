class InitializePoolContract{
    constructor(){

    };
    createPoolContract(){

        var fs = require('fs');
        if (fs.existsSync('poolContract.json')) {
            console.log('Pool of contract`s already created');
        };
        if (!fs.existsSync('poolContract.json')) {
            const createPoolContractJSON = require('./createPoolContract')
            const newCreatePoolContractJSON = new createPoolContractJSON();
            newCreatePoolContractJSON.generatePoolContractJSON();
        };
    };
};

module.exports = InitializePoolContract;