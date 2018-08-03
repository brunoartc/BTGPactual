var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btgcode-22a0c.firebaseio.com"
});


class Control{
    constructor(){

    };
    receiveClosedOrder(){

        function accountInfo() {
            return new Promise(function(resolve, reject) {
              admin.database().ref('/orderstatement/').once('value').then(function(snap) {
                if (snap.val() != undefined) {
                  return resolve(snap.val())
                } else {
                  return reject("Transacao nao concluida")
                }
              });
            })
          } //TODO endpoint que retorne essa funcao
        
        accountInfo().then(function(closedOrder){
            const sendIPFSClosedOrder = require('./sendIPFSClosedOrder')
            const newsendIPFSClosedOrder = new sendIPFSClosedOrder(closedOrder);
            newsendIPFSClosedOrder.getID();
        });
    };
    receiveContract(){

        function accountInfo() {
            return new Promise(function(resolve, reject) {
              admin.database().ref('/info/contracts/').once('value').then(function(snap) {
                if (snap.val() != undefined) {
                  return resolve(snap.val())
                } else {
                  return reject("Transacao nao concluida")
                }
              });
            })
          } //TODO endpoint que retorne essa funcao
        
        accountInfo().then(function(contract){
            const sendIPFSContract = require('./sendIPFSContract')
            const newsendIPFSContract = new sendIPFSContract(contract);
            newsendIPFSContract.getID();
        });
    };
};

const runControl = new Control();
runControl.receiveClosedOrder();
runControl.receiveContract();