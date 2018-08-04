const ipfs = require('./ipfsAPI')

class SearchID{
    constructor(id){
        this._id = id
    }
    readMatch(){
        const fs = require('fs')

        if(fs.existsSync('dataHashCloserOrderID.json')){
            var dataHashCloserOrderID = JSON.parse((fs.readFileSync('dataHashCloserOrderID.json','utf-8')));
            for (var i in dataHashCloserOrderID[1]["_path"]["ids"]){
                if(this._id == dataHashCloserOrderID[1]["_path"]["ids"][i]){
                    console.log('Found ID in closed Order`s')
                    console.log(dataHashCloserOrderID[1]["_path"]["hash"])
                    this.getDataIPFSClosedOrder(dataHashCloserOrderID[1]["_path"]["hash"])
                }
            }
        }

        if (fs.existsSync('dataHashContractID.json')){
            var dataHashContractID = JSON.parse((fs.readFileSync('dataHashContractID.json','utf-8')))
            for (var i in dataHashContractID[1]["_path"]["ids"]){
                if (this._id == dataHashContractID[1]["_path"]["ids"][i]){
                    console.log('Found ID in contract`s')
                    this.getDataIPFSContract(dataHashContractID[1]["_path"]["hash"])
                }
            }
        }
    }
    getDataIPFSContract(hashIPFS){

        var ID = this._id;

        ipfs.files.get(hashIPFS, function (err, files) {
            var content = JSON.parse((files[0].content).toString('utf8'));
            for (var i in content){
                 for (var e in content[i]){
                    if (ID == content[i][e]["id"]){
                        console.log(content[i][e])
                    }
                 }
            }
        })
    }
    getDataIPFSClosedOrder(hashIPFS){

        var ID = this._id;

        ipfs.files.get(hashIPFS, function (err, files) {
            var content = JSON.parse((files[0].content).toString('utf8'));
            for (var i in content){
                 for (var e in content[i]){
                    if (ID == content[i][e]["dateTime"]){
                        console.log(content[i][e])
                    }
                 }
            }
        })
    }
}


// const runSearchContract = new SearchID('2018-01-01_CALL_5');
// runSearchContract.readMatch()

module.exports = SearchID;