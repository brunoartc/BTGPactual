class InitializePoolClosedOrder{
    constructor(){

    };
    createPoolClosedOrder(){

        var fs = require('fs');
        if (fs.existsSync('poolClosedOrder.json')) {
            console.log('Pool of closed order`s already created');
        };
        if (!fs.existsSync('poolClosedOrder.json')) {
            const createClosedOrderJSON = require('./createPoolClosedOrder')
            const newCreateClosedOrderJSON = new createClosedOrderJSON();
            newCreateClosedOrderJSON.generateClosedOrderJSON();
        };
    };
};

module.exports = InitializePoolClosedOrder;