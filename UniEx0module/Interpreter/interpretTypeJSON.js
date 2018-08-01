class InterpretTypeJSON{
    constructor(){

    };
    typeJSON(namefileJSON){

        const readJSON = require('./readJSON');
        const newReadJSON = new readJSON();
        newReadJSON.readJSON(namefileJSON);
        this._typeJSON = newReadJSON._typeJSON;
        this._id = newReadJSON._id;

    };
};

module.exports = InterpretTypeJSON;