var fs = require('fs');

class AddClosedOrderPool{
    constructor(idClosedOrder){

        this.readClosedOrderID(idClosedOrder);
        this.addClosedOrder();

    };
    readClosedOrderID(idClosedOrder){

        var dataClosedOrder = JSON.parse(fs.readFileSync(idClosedOrder + '.json', 'utf8'));
        this._newClosedOrder = dataClosedOrder[1];

    };
    addClosedOrder(){

        var dataPoolClosedOrder = JSON.parse(fs.readFileSync('poolClosedOrder.json', 'utf8'));
        dataPoolClosedOrder[1]["_closedOrder"].push(this._newClosedOrder);
        fs.writeFile('poolClosedOrder.json', JSON.stringify(dataPoolClosedOrder),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolClosedOrder.json with update]: sucess')
        });
    };
};

module.exports = AddClosedOrderPool;
