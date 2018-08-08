const admin = require("firebase-admin");

class MatchIDClosedOrderHash{
    constructor(){

    };
    matchIDClosedOrderHash(hash,ids){
        const fs = require('fs');

        const callSendHashClosedOrderIPFS = require('./control')
        callSendHashClosedOrderIPFS.sendHashIPFSEthClosedOrder(hash);

        if (fs.existsSync('dataHashCloserOrderID.json')) {
            var dataHashClosedOrder = JSON.parse(fs.readFileSync('dataHashCloserOrderID.json', 'utf8'));
            var newMatch = {_path:{ids,hash}};
            dataHashClosedOrder.push(newMatch);
            fs.writeFile('dataHashCloserOrderID.json', JSON.stringify(dataHashClosedOrder),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashCloserOrderID.json with update]: sucess')
                var dataHashCloserOrderID = JSON.parse((fs.readFileSync('dataHashCloserOrderID.json','utf-8')));
                admin.database().ref('/ipfs/dataHashClosedOrderID').set({"dataHashClosedOrderID":dataHashCloserOrderID})
            });
        };
        if (!fs.existsSync('dataHashCloserOrderID.json')) {
            var data = [{_typeJSON:'matchIDClosedOrderHash'},{_path:{ids,hash}}]
            fs.writeFile('dataHashCloserOrderID.json', JSON.stringify(data),function(err){
                if (err){
                    throw err;
                }
                console.log('[Wrote file dataHashClosedOrder.json]: sucess')
                var dataHashCloserOrderID = JSON.parse((fs.readFileSync('dataHashCloserOrderID.json','utf-8')));
                admin.database().ref('/ipfs/dataHashClosedOrderID').set({"dataHashClosedOrderID":dataHashCloserOrderID})
            });
        };
    };
};


module.exports = MatchIDClosedOrderHash;