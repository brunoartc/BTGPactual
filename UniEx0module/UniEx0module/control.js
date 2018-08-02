const interpretTypeJSON = require('./Interpreter/interpretTypeJSON.js');
const initializePoolContract = require('./PoolContract/initializePoolContract');
const initializePoolClosedOrder = require('./PoolClosedOrder/initializePoolClosedOrder');
const initializePoolIPFS = require('./SendPoolIPFS/initializePoolIPFS');
const addClosedOrderPool = require('./PoolClosedOrder/addClosedOrderPool');
const addContractPool = require('./PoolContract/addContractPool');
const addPoolIPFS = require('./SendPoolIPFS/addPoolIPFS');

class Control{
    constructor(filenameJSON){

        this._generatePoolClosedOrder = new initializePoolClosedOrder();
        this._generatePoolContract = new initializePoolContract();
        this._generatePoolIPFS = new initializePoolIPFS();
        this._generatePoolClosedOrder.createPoolClosedOrder();
        this._generatePoolContract.createPoolContract();
        this._generatePoolIPFS.createPoolIPFS();

    };

    interpretJSON(filenameJSON){

        this._newInterpretTypeJSON = new interpretTypeJSON();
        this._newInterpretTypeJSON.typeJSON(filenameJSON);
        this.identifyAction();

    };

    identifyAction(){

        if (this._newInterpretTypeJSON._typeJSON == 'newContract'){
            this._newAddContractPool = new addContractPool(this._newInterpretTypeJSON._id);

        };
        if (this._newInterpretTypeJSON._typeJSON == 'newClosedOrder'){
            this._newAddClosedOrderPool = new addClosedOrderPool(this._newInterpretTypeJSON._id);

        };
    };

    sendPoolIPFS(namepoolJSON){

        this._newAddPoolIPFS = new addPoolIPFS(namepoolJSON);

    };
    executeActionJSON(){

        const readPoolJSON = require('./Pool/readPoolJSON');
        const newReadPoolJSON = new readPoolJSON();
        newReadPoolJSON.readPoolJSON();
        for (var i in newReadPoolJSON._dataPoolJSON[1]["_actions"]){
            const readOptionID = require('./PoolOption/readOptionID');
            const newReadOptionID = new readOptionID();
            newReadOptionID.createOptions();
            if(newReadPoolJSON._dataPoolJSON[1]["_actions"][i]["_action"] == 'newOption');
                newReadOptionID.readOptionID(newReadPoolJSON._dataPoolJSON[1]["_actions"][i]["_id"]);
                // newReadOptionID.addOption();

        };
    };
};

// run first 
runControl = new Control();

// run second (don't run this with the code above)
// runControl.interpretJSON('BRLUSD4754');

// run thirt
// don't run interpretJSON and sendPoolIPFS at the same time
// runControl.sendPoolIPFS('poolClosedOrder')