const ipfs = require('./ipfsAPI')

class SendIPFSClosedOrder{
    constructor(closedOrder){

        this._closedOrder = closedOrder;
        this._closedOrderID = [];

    };
    getID(){

        for (var i in this._closedOrder){
            this._closedOrderID.push(this._closedOrder[i].dateTime)
        };
        this.sendClosedOrder()
    };
    sendClosedOrder(){

        const fs = require('fs')

        var ids = this._closedOrderID;

        this._closedOrderArray = [this._closedOrder]

        if (fs.existsSync('dataHashCloserOrderID.json')) {

            var dataHashCloserOrderID = JSON.parse((fs.readFileSync('dataHashCloserOrderID.json','utf-8')));
            var dataHashCloserOrderIDReverse = dataHashCloserOrderID.reverse();
            var dataHashClosedOrderLastHash = dataHashCloserOrderIDReverse[0]._path.hash;
            this._closedOrderArray.push({_lastHash:dataHashClosedOrderLastHash})

        };

        this._closedOrderBuffer = Buffer.from(JSON.stringify(this._closedOrderArray));

        ipfs.files.add(this._closedOrderBuffer, function(err,files){
            if (err){
                throw err
            }
            const matchIDClosedOrderHash = require('./matchIDClosedOrderHash')
            const newMatchIDClosedOrderHash = new matchIDClosedOrderHash();
            newMatchIDClosedOrderHash.matchIDClosedOrderHash(files[0].hash,ids)
        });
    };
};

module.exports = SendIPFSClosedOrder;