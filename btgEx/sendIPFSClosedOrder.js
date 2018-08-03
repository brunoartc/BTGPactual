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

        this._closedOrderBuffer = Buffer.from(JSON.stringify(this._closedOrder));

        var ids = this._closedOrderID;

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