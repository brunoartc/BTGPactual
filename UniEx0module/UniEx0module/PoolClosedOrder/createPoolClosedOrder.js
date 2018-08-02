class CreateClosedOrderJSON{
    constructor(){

    };
    generateClosedOrderJSON(){
        const fs = require('fs');
        var closedOrder = [{_typeJSON: 'poolClosedOrder'},{_idPool:'ABC123',_closedOrder:[]}]
        fs.writeFile('poolClosedOrder.json', JSON.stringify(closedOrder),function(err){
            if (err){
                throw err;
            }
            console.log('[Wrote file poolClosedOrder.json]: sucess')
        });
    };
};

module.exports = CreateClosedOrderJSON;