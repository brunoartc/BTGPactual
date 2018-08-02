class InitializePoolIPFS{
    constructor(){

    };
    createPoolIPFS(){

        var fs = require('fs');
        if (fs.existsSync('poolIPFS.json')) {
            console.log('Pool of IPFS file`s already created');
        };
        if (!fs.existsSync('poolIPFS.json')) {
            const createPoolIPFSJSON = require('./createPoolIPFS')
            const newCreatePoolIPFSJSON = new createPoolIPFSJSON();
            newCreatePoolIPFSJSON.generatePoolIPFSJSON();
        };
    };
};

module.exports = InitializePoolIPFS;