const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

var ipfsAPI = require('ipfs-api')
var ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
var ordersLastHash = 0
var contractsLastHash = 0
var hashlist = []

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://btgcode-22a0c.firebaseio.com"
});


app.use(cookieParser());

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));


app.post('/contratos/cadastrar', function(req, res) {
  var fdata = {}
  fdata.creationDate = Date.now()
  fdata.strike = req.body.strike
  fdata.validThru = req.body.validThru
  fdata.type = req.body.type

  admin.database().ref('/contracts/' + req.body.validThru + "/" + req.body.type + "/"+ fdata.strike ).set({"info":fdata})
  admin.database().ref('/validThru/contracts/' + req.body.validThru + "_" + req.body.type + "_" + fdata.strike).set(req.body.validThru)
  fdata.id = req.body.validThru + "_" + req.body.type + "_" + fdata.strike
  admin.database().ref('/info/contracts/' + req.body.validThru + "_" + req.body.type + "_" + fdata.strike + "BRL").set(fdata)
  res.send("Contrato cadastrado com sucesso")
}); //OKK


app.get('/contratos', function(req, res) {
  admin.database().ref('/validThru/contracts/').once('value', function(snapshot) {
    res.send(snapshot.val())
  });
}); //OKK RECUPERA A VALIDADE DE CADA CONTRATO


app.get('/contratos/full', function(req, res) {
  admin.database().ref('/info/contracts/').once('value', function(snapshot) {
    res.send(snapshot.val()) //RECUPERA INFORMACOES COM INFOS TOTAIS DOS CONTRATOS
  });
}); //OKK

app.post('/contratos/ordens/cadastrar', function(req, res) {
  var fdata = {}
  //BUG assinar contrato com assinatura digital(NADA IMPORTANTE, NAO DA TEMPO)
  fdata.contractId = req.body.contractId
  fdata.accountId = req.body.accountId
  fdata.price = req.body.price //CADASTRAR UMA ORDEM NO SISTEMA COM SEU ID
  fdata.amount = req.body.amount
  fdata.type = req.body.type
  id = admin.database().ref('/contracts/' + req.body.contractId + '/orders/').push(fdata).name()
  admin.database().ref('/contracts/' + req.body.contractId + '/orders/ids').set(id)
  res.send("Ordem cadastrado com sucesso")
});



app.get('/contratos/ordens/', function(req, res) {
  admin.database().ref('/contracts/' + req.body.contractId + '/orders').once('value', function(snapshot) {
    var response = {};
    response = snapshot.val()
    for (var i in response) {  //PEGAR TODOS AS ORDENS DE UM CONTRATO
      response[i].total = parseFloat(response[i].amount) * parseFloat(response[i].price)
    }
    res.send(response)
  });
});

app.get('/contratos/ordens/ids', function(req, res) {
  admin.database().ref('/contracts/' + req.body.contractId + '/orders/ids').once('value', function(snapshot) {
    var response = {};
    response = snapshot.val()
    for (var i in response) {  //PEGAR TODOS OS IDS DE UM CONTRATO
      response[i].total = parseFloat(response[i].amount) * parseFloat(response[i].price)
    }
    res.send(response)
  });
});



function logEvery2Seconds(i) {
    setTimeout(() => {
        admin.database().ref('/orderstatement').once('value', function(snapshot) {
          sendToIPFS(snapshot.val(),ordersLastHash,0)
        })
        admin.database().ref('/info/contracts').once('value', function(snapshot) {
          sendToIPFS(snapshot.val(),contractsLastHash,1)
        })
        logEvery2Seconds(++i);
    }, 10000)
}

logEvery2Seconds(0);

let i = 0;
setInterval(() => {
    console.log('Sync database n°', i++);
}, 10000)


function sendToIPFS(obje,lastHash,tipe) {
  return new Promise(function(resolve, reject) {
    if (lastHash != undefined){
      obje.lastHash = lastHash
    } else {
      reject("NO LAST HASH, SRY")
    }

    ipfs.files.add(Buffer.from([lastHash,Date.now(),obje]), function(err, file){
        if (err){
            throw err;
        };
        hashlist.push(obje.lastHash + "=>" + file[0].hash + "(" + tipe + ")")
        console.log(obje.lastHash + "=>" + file[0].hash);
        lastHash = file[0].hash
        if (tipe) {
          contractsLastHash = lastHash
        } else {
          ordersLastHash = lastHash
        }
    });
  })

}



function infoFromContract(contractId, id, amount) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId).child('info').once('value').then(function(snap) {
      if (snap.val() != undefined) {
        return resolve(snap.val()) //RECUPERA INFOS DE UMA CONTA
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}

function validInfo(contractId) {
  return new Promise(function(resolve, reject) {
    contractId = contractId.replace("/","_")
    console.log("cd",contractId);
    contractId = contractId.replace("/","_")
    console.log("cd",contractId);
    admin.database().ref('/validThru/contracts/' + contractId.replace("/","_").replace("/","_")).once('value').then(function(snap) {
      //RECUPERA VALIDADE DOS CONTRATOS
      console.log("teste snap",snap.val(),'/validThru/contracts/' + contractId.replace("/","_"));
      if (snap.val() != undefined) {
        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}

function accountInfo(accountId,res) {
  return new Promise(function(resolve, reject) {
    admin.database().ref('/account/' + accountId).once('value').then(function(snap) {
      if (snap.val() != undefined) {
        res.send(snap.val())
        return resolve(snap.val())
      } else { //RECUPERA INFOS DA CONTA
        return reject("Transacao nao concluida")
      }
    });
  })
}


app.get('/account/info/:accountId', function(req, res) {
  accountInfo(req.params.accountId,res).then((resp,res) => console.log(res)) //RETORNA INFOS DA CONTA
});




function buyFromContract(contractId, id, amount) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/orders/").child(id).once('value').then(function(snap) {
      //console.log(12321123123, snap.val().amount);
      if (snap.val().amount >= amount) { //RETIRA QUANTIDADE DE UMA ORDEM
        //console.log("entrou dentr ode amount");
        admin.database().ref("/contracts/" + contractId + "/orders/" + id).child("amount").set(snap.val().amount - amount)

        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}


function creditFromContract(contractId, fromAccountId, toAccountId, amount, contract, validThru) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child(toAccountId).once('value').then(function(snap) {
      if (1 == 1) {
        if (contract.type == -1){
          //TODO: *************** cria contrato ordem ***************(isso tmb eh importante mas o outro eh mais)
          console.log("type -1");
        } else { //REALIZA ACOES DE UMA ORDEM
          //console.log("deu contrato pro ",fromAccountId);
          if (snap.val()!=null) {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child(toAccountId).set(snap.val() + contract.type * amount) //ganha contratos
          } else {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId + "/" + toAccountId + "/").set(contract.type * amount) //ganha contratos
          }


        }

        admin.database().ref("/account/" + fromAccountId).once('value').then(function(snap) {
          if (contract.type == 1){

            admin.database().ref("/account/" + fromAccountId + "/contracts/" + validThru + "/" + contractId.replace("/","_").replace("/","_")).set(true) //perde dinheiro ou ganha
          }
          admin.database().ref("/account/" + fromAccountId).child("money").set(snap.val().money - contract.type * amount * contract.price) //perde dinheiro ou ganha
        })
        //




        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}








function debitFromContract(contractId, fromAccountId, toAccountId, amount, contract, validThru) {
  return new Promise(function(resolve, reject) {
    //console.log("debito foi chamado");
    admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId).child(fromAccountId).once('value').then(function(snap) {
      if (1 == 1) {
        if (contract.type == -1){
          //TODO cria contrato ordem do from account ( isso eh menos importante)
          //console.log("cria contrato");
          //console.log("deu contrato pro ",toAccountId);
          if (snap.val()!=null) {

//REALIZA ACOES DE UMA ORDEM (inversa)
            admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId).child(fromAccountId).set(snap.val() + amount) //ganha contratos
          } else {
            //console.log("deu contrato pro ",toAccountId);
            admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId + "/" + fromAccountId + "/").set(amount) //ganha contratos
          }
        } else {



        }

        admin.database().ref("/account/" + toAccountId).once('value').then(function(snap) {
          if (contract.type == -1){
            admin.database().ref("/account/" + fromAccountId + "/contracts/" + validThru + "/" + contractId).set(true) //perde dinheiro ou ganha
          }

          admin.database().ref("/account/" + toAccountId).child("money").set(snap.val().money + contract.type * amount * contract.price) //perde dinheiro ou ganha
          logOrder({"contractId":contractId, "fromAccountId":fromAccountId, "toAccountId":toAccountId, "amount":amount, "type":contract.type, "price":contract.price, "dateTime":Date.now()})
        })
        //




        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}



function logOrder(fdata) {
  admin.database().ref('/orderstatement').push(fdata) //LOGA UM ORDEM
}

function functionName() {
 //TODO NAO SEI PQ TA AQUI, TO CANSADO
}








app.post('/contratos/ordem/executar', function(req, res) {
  var fdata = {}
  fdata.fromUserId = req.body.fromUserId
  fdata.toUserId = req.body.toUserId
  fdata.orderId = req.body.orderId
  fdata.amount = req.body.amount

  buyFromContract(req.body.orderId, req.body.amount).then().catch()

//EXECUTA UMA ORDEM
  admin.database().ref('/contracts').push(fdata)
  res.send("Contrato cadastrado com sucesso")
});




app.get('/cte', function(req, res) {
  fromAccount = 2
  toAccount = 1 //(teste)EXECUTA UMA ORDEM
  idContrato = "2018-01-01/CALL/5" //     validate/opcao/strike
  idOrdem = "-LIwrP8ymAGRjIYHZYnA"
  amount = 1
  // type -1 = venda
  buyFromContract(idContrato, idOrdem, amount).then(function(snap) {
    validInfo(idContrato).then(function(teste) {
      //console.log("teste",teste);
      debitFromContract(idContrato, fromAccount, toAccount, amount, snap, teste).then(console.log("debitou")).catch(console.log("bugou debito"))
      creditFromContract(idContrato, fromAccount, toAccount, amount, snap, teste).then(console.log("creditou")).catch(console.log("bugou creadit"))
    }).catch(console.log("not valid info"))
    // debitFromContract(idContrato, fromAccount, toAccount, amount, snap).then(console.log("debitou")).catch(console.log(456))
    // creditFromContract(idContrato, fromAccount, toAccount, amount, snap).then(console.log("creditou")).catch(console.log(456))
    //TOO Registar ordens finalizadas no banco de dados em /statement/orders quase DONE ja
  }).catch(console.log("deu tudo errado"))
  res.send("Contrato cadastrado com sucesso")
});


// TODO: ********************************
// TODO: FAZER O EXERCIMENTO DO DIREITO DA OPCAO Contrato ahhhh PUT ou CALL (ultimo item do BTGCode)
// TODO: *******************************

app.get('/ping', function(req, res) {
  res.send("Pong!")
});

app.get('/checkhashes', function(req, res) {
  res.send(hashlist)
});


app.listen(process.env.PORT || 4000, function() {
  console.log('Example app listening on port 4001!'); //INICIA O APP
});
