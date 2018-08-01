class ReadJSON{
    constructor(){

    };
    readJSON(namefileJSON){

        var fs = require('fs');
        var dataJSON = JSON.parse(fs.readFileSync(namefileJSON + '.json', 'utf8'));
        this._typeJSON = dataJSON[0]["_typeJSON"];
        this._id = dataJSON[1]["_id"];
    };
};

module.exports = ReadJSON;