const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

app.set('view engine', 'ejs');

app.use('/', express.static('views'));

//Page files
var check = require('./views/check').main;
var user = require('./views/user').main;
var history = require('./views/history').main;
var core = require('./views/core').main;
// var ipfsAPI = require('ipfs-api')
// var ipfs = ipfsAPI({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
// var ordersLastHash = 0
// var contractsLastHash = 0
// var hashlist = []

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





app.post('/contratos/simples/cadastrar', function(req, res) {
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


app.post('/contratos/barreira/cadastrar', function(req, res) {
  var fdata = {}
  fdata.creationDate = Date.now()
  fdata.strike = req.body.strike
  fdata.validThru = req.body.validThru
  fdata.downup = req.body.downup
  fdata.inout = req.body.inout
  fdata.barrier = req.body.barrier
  fdata.type = req.body.type // vanila or barrier
  fdata.option = req.body.option // call put
  fdata.valid=(fdata.inout != 'IN')
//FAZER AQUI AQUIIIII
  admin.database().ref('/contracts/' + req.body.type + "/" + req.body.validThru + "/" + fdata.downup + "/" + fdata.barrier + "/" + fdata.inout ).set({"info":fdata})
  admin.database().ref('/validThru/contracts/' + req.body.type + "_" + req.body.validThru + "_" + fdata.downup + "_" + fdata.barrier + "_" + fdata.inout).set(req.body.validThru)
  fdata.id = req.body.type + "_" + req.body.validThru + "_" + fdata.downup + "_" + fdata.barrier + "_" + fdata.inout

  admin.database().ref('/info/contracts/' + req.body.type + "_" + req.body.validThru + "_" + fdata.downup + "_" + fdata.barrier + "_" + fdata.inout + "BRL").set(fdata)
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
  id = admin.database().ref('/contracts/' + req.body.contractId + '/orders/').push(fdata)
  fdata.id = id
  id = admin.database().ref('/contracts/' + req.body.contractId + '/orders/' + id).set(fdata)
  admin.database().ref('/contracts/' + req.body.contractId + '/orders/ids').set(id.getKey())

  res.send("Ordem cadastrado com sucesso")
});

// app.post('/contratos/ordens/barreira/cadastrar', function(req, res) {
//   var fdata = {}
//   //BUG assinar contrato com assinatura digital(NADA IMPORTANTE, NAO DA TEMPO)
//   fdata.contractId = req.body.contractId
//   fdata.downup = req.body.downup
//   fdata.inout = req.body.inout
//   fdata.barrier = req.body.barrier
//   fdata.accountId = req.body.accountId
//   fdata.price = req.body.price //CADASTRAR UMA ORDEM NO SISTEMA COM SEU ID
//   fdata.amount = req.body.amount
//   fdata.type = req.body.type
//   id = admin.database().ref('/contracts/' + req.body.contractId + '/orders/').push(fdata)
//   fdata.id = id
//   id = admin.database().ref('/contracts/' + req.body.contractId + '/orders/' + id).set(fdata)
//   admin.database().ref('/contracts/' + req.body.contractId + '/orders/ids').set(id.getKey())
//
//   res.send("Ordem cadastrado com sucesso")
// });

function buildOrders(response) {
  divtemplate = ['<div class="second w-row"><div class="column-11 w-col w-col-6"><p class="paragraph-3 sell">','</p></div><div class="column-12 w-col w-col-6"><p class="paragraph-4">','</p></div></div><form action="contratos/ordem/executar" method="post"><input type="hidden" name="fromAccount" value="','"><input type="hidden" name="toAccount" value="','"><input type="hidden" name="idContrato" value="','"><input type="hidden" name="idOrdem" value="','"><input type="hidden" name="amount" value="','"><input type="submit" class="link-5 w-button" value="Executar"></form>']
  //TODO me ajuda por favor




  resp = []

  for (var i in response) {  //PEGAR TODOS AS ORDENS DE UM CONTRATO
    resp.push(divtemplate[0] + response[i].amount + divtemplate[1] + response[i].price + divtemplate[2] + "2" + divtemplate[3] + response[i].accountId + divtemplate[4] + response[i].contractId + divtemplate[5] + response[i].orderId + divtemplate[6] + response[i].amount + divtemplate[7])
  }
  return resp

}



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

app.get('/teste', function(req, res) {
  admin.database().ref('/contracts/' + req.query.contractId + '/orders').once('value', function(snapshot) {
    var response = {};
    response = snapshot.val()
    for (var i in response) {  //PEGAR TODOS AS ORDENS DE UM CONTRATO
      response[i].total = parseFloat(response[i].amount) * parseFloat(response[i].price)
    }



    res.send(core(buildOrders(response)))
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



app.get('/insert/ptax', function(req, res) {
  ptax = req.query.ptax
  lastptax = req.query.lastptax
  var data = new Date()
  day = data.getDate()
  mounth = data.getMonth()+1
  year = data.getFullYear()
  admin.database().ref('/contracts/barrier/').once('value', function(snap) {
    invalidDates = []
    for (i in snap.val()){
      dataContrato = i.split("-")

      if ((year <= parseInt(dataContrato[0])) && (mounth <= parseInt(dataContrato[1])) && (day <= parseInt(dataContrato[2]))){
        dataId = dataContrato.join('-')
        console.log('teste',dataId);
        //down up
        //barrier
        //inout
        // admin.database().ref('/contracts/barrier/' + dataContrato.join('-') + "/UP/" + fdata.barrier + "/" + fdata.inout + "/info/valid" ).set(false)
        admin.database().ref('/contracts/barrier/' + dataId + "/UP/").once('value', function(snapq) {
          console.log(snapq.val());
          for (i in snapq.val()){
            console.log("SUBINDO",'/contracts/barrier/' + dataId + "/UP/" + i + "/IN/info/valid");
            if (lastptax < i && i > ptax){ //SUBINDO
              admin.database().ref('/contracts/barrier/'+ dataId +'/UP/'+ i +'/OUT/info/valid').set(false)
              admin.database().ref('/contracts/barrier/'+ dataId +'/UP/'+ i +'/IN/info/valid').set(true)
                //admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId + "/" + toAccountId + "/").set(contract.type * amount) //ganha contratos
            } //pedir pro andre perguntar pro rafael
          }
        });

        admin.database().ref('/contracts/barrier/' + dataId + "/DOWN/").once('value', function(snapq) {
          for (i in snapq.val()){
            if (lastptax > i && i < ptax){ //DESCENDO
              console.log("DESUBINDO", '/contracts/barrier/' + dataId + "/DOWN/" + i + "/IN/info/valid", i);
              admin.database().ref('/contracts/barrier/'+ dataId +'/DOWN/'+ i +'/OUT/info/valid').set(false)
              admin.database().ref('/contracts/barrier/'+ dataId +'/DOWN/'+ i +'/IN/info/valid').set(true)
            } //pedir pro andre perguntar pro rafael
          }
        });
      }
    }
    res.send("OK")

  })





});



// function logEvery2Seconds(i) {
//     setTimeout(() => {
//         admin.database().ref('/orderstatement').once('value', function(snapshot) {
//           sendToIPFS(snapshot.val(),ordersLastHash,0)
//         })
//         admin.database().ref('/info/contracts').once('value', function(snapshot) {
//           sendToIPFS(snapshot.val(),contractsLastHash,1)
//         })
//         logEvery2Seconds(++i);
//     }, 10000)
// }
//
// logEvery2Seconds(0);
//
// let i = 0;
// setInterval(() => {
//     console.log('Sync database n°', i++);
// }, 10000)
//
//
// function sendToIPFS(obje,lastHash,tipe) {
//   return new Promise(function(resolve, reject) {
//     if (lastHash != undefined){
//       obje.lastHash = lastHash
//     } else {
//       reject("NO LAST HASH, SRY")
//     }
//
//     ipfs.files.add(Buffer.from([lastHash,Date.now(),obje]), function(err, file){
//         if (err){
//             throw err;
//         };
//         hashlist.push(obje.lastHash + "=>" + file[0].hash + "(" + tipe + ")")
//         console.log(obje.lastHash + "=>" + file[0].hash);
//         lastHash = file[0].hash
//         if (tipe) {
//           contractsLastHash = lastHash
//         } else {
//           ordersLastHash = lastHash
//         }
//     });
//   })
//
// }



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
        //res.send(snap.val())
        return resolve(snap.val(),res)
      } else { //RECUPERA INFOS DA CONTA
        return reject("Transacao nao concluida")
      }
    });
  })
}


app.get('/account/info/:accountId', function(req, res) {
  accountInfo(req.params.accountId,res).then((resp,res) => console.log(res)) //RETORNA INFOS DA CONTA
});



function checkBuild(contractId) {
  divtemplate = ['<div class="row-6 w-row"><div class="column-21 w-col w-col-4"><div class="text-block-6">','</div></div><div class="column-22 w-col w-col-4"><div class="text-block-7">','</div></div><div class="column-23 w-col w-col-4"><div class="text-block-8">','</div></div></div>']
  response = []
  for (i in contractId){
    jooj = i.split("_")
    response.push(divtemplate[0] + jooj[0] + divtemplate[1] + jooj[1] + divtemplate[2] + jooj[2] + divtemplate[3])

  }
  return (check(response.join()))

}


function accountBuild(accountId) {
  divtemplate = ['<div class="row-4 w-row"><div class="column-15 w-col w-col-4"><div class="text-block-2">','</div></div><div class="column-16 w-col w-col-4"><div class="text-block">','</div></div><div class="column-17 w-col w-col-4"><form action="history.html" method="post"><input type="submit" class="link-5 w-button" value="Info"><input type="hidden" name="accountId" value="','"></form></div></div>']
  response = []
  for (i in accountId){
    response.push(divtemplate[0] + i + divtemplate[1] + accountId[i].money + divtemplate[2] + i + divtemplate[3])

  }
  return (user(response.join()))

}

app.get('/check/contracts', function (req, res) {
  admin.database().ref('/validThru/contracts/').once('value', function(snapshot) {

    res.send(checkBuild(snapshot.val()))
  });
  // divtemplatea = ['<div class="row-6 w-row"><div class="column-21 w-col w-col-4"><div class="text-block-6">','</div></div><div class="column-22 w-col w-col-4"><div class="text-block-7">','</div></div><div class="column-23 w-col w-col-4"><div class="text-block-8">','</div></div></div>']
  //
  // res.render('check',{divtemplatea})


})

app.get('/check/accounts', function (req, res) {
  admin.database().ref('/account/').once('value', function(snapshot) {

    res.send(accountBuild(snapshot.val()))
  });
  // divtemplatea = ['<div class="row-6 w-row"><div class="column-21 w-col w-col-4"><div class="text-block-6">','</div></div><div class="column-22 w-col w-col-4"><div class="text-block-7">','</div></div><div class="column-23 w-col w-col-4"><div class="text-block-8">','</div></div></div>']
  //
  // res.render('check',{divtemplatea})


})


app.get('/check/account/history/:accountId', function (req, res) {
  //accountInfo(req.params.accountId,res).then((resp,res) => {accountHistoryBuild(resp,res)}) //RETORNA INFOS DA CONTA
  admin.database().ref('/account/' + req.params.accountId).once('value').then(function(snap) {
    res.send(accountHistoryBuild(snap.val()))
  });
})

//=============================================== FAKE

app.get('/check.html', function (req, res) {
  admin.database().ref('/validThru/contracts/').once('value', function(snapshot) {

    res.send(checkBuild(snapshot.val()))
  });
  // divtemplatea = ['<div class="row-6 w-row"><div class="column-21 w-col w-col-4"><div class="text-block-6">','</div></div><div class="column-22 w-col w-col-4"><div class="text-block-7">','</div></div><div class="column-23 w-col w-col-4"><div class="text-block-8">','</div></div></div>']
  //
  // res.render('check',{divtemplatea})


})

app.get('/user.html', function (req, res) {
  admin.database().ref('/account/').once('value', function(snapshot) {

    res.send(accountBuild(snapshot.val()))
  });
  // divtemplatea = ['<div class="row-6 w-row"><div class="column-21 w-col w-col-4"><div class="text-block-6">','</div></div><div class="column-22 w-col w-col-4"><div class="text-block-7">','</div></div><div class="column-23 w-col w-col-4"><div class="text-block-8">','</div></div></div>']
  //
  // res.render('check',{divtemplatea})


})


app.post('/history.html', function (req, res) {
  //accountInfo(req.params.accountId,res).then((resp,res) => {accountHistoryBuild(resp,res)}) //RETORNA INFOS DA CONTA
  admin.database().ref('/account/' + req.body.accountId).once('value').then(function(snap) {
    res.send(accountHistoryBuild(snap.val(), req.body.accountId))
  });
})

//======================================= FAKE

function accountHistoryBuild(accountHistory,wwww) {
  console.log(accountHistory);
  divtemplate = ['<div class="row-5 w-row"><div class="column-18 w-col w-col-3"><div class="text-block-3">','</div></div><div class="column-19 w-col w-col-3"><div class="text-block-4">','</div></div><div class="column-20 w-col w-col-3"><div class="text-block-5">','</div></div><div class="column-25 w-col w-col-3"><form action="executar/direito/opcao" method="post"><input type="submit" class="link-6 w-button" value="Execute"><input type="hidden" name="contractId" value="','"><input type="hidden" name="accountId" value="','">Execute</form></div></div>']
  response = []

    for (i in accountHistory.contracts) {
        response.push(divtemplate[0] + accountHistory.contracts[i].amount + divtemplate[1] + accountHistory.contracts[i].toAccountId + divtemplate[2] + accountHistory.contracts[i].contractId + divtemplate[3] + i + divtemplate[4] + wwww + divtemplate[5])
        console.log("coaca")
    }
  //res.send(history(response.join()))
  return (history(response.join()))

}


function executarOrdem(dayPrice, contractId, accountId) {
  return new Promise(function(resolve, reject) {
  admin.database().ref('/account/' + accountId + '/contracts/' + contractId).once('value').then(function(snap) {
    console.log('/account/' + accountId + '/contracts/' + contractId, snap.val());
    snapshot = snap.val()
    contract = snapshot.contractId.split("/")
    if (contract[1] === "CALL") {
      ordemResult = (dayPrice - contract[2]) * snapshot.amount
  } else if (contract[1] === "PUT") {
    ordemResult = (contract[2] - dayPrice) * snapshot.amount
  }

  admin.database().ref("/account/" + accountId).once('value').then(function(snap) {



    admin.database().ref("/account/" + accountId).child("money").set(snap.val().money + ordemResult) //perde dinheiro ou ganha

  })


  admin.database().ref("/account/" + snapshot.toAccountId).once('value').then(function(snap) {



    admin.database().ref("/account/" + snapshot.toAccountId).child("money").set(snap.val().money - ordemResult) //perde dinheiro ou ganha

  })

  resolve("Transacao concluida")


  });
})
}

//executarOrdem(6,"2018-01-01_CALL_5",2)






function buyFromContract(contractId, id, amount) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/orders/").child(id).once('value').then(function(snap) {
      console.log(12321123123, snap.val().amount);
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
          console.log("deu contrato pro ",fromAccountId);
          if (snap.val()!=null) {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child(toAccountId).set(snap.val() + contract.type * amount) //ganha contratos
          } else {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId + "/" + toAccountId + "/").set(contract.type * amount) //ganha contratos
          }


        }

        admin.database().ref("/account/" + fromAccountId).once('value').then(function(snap) {
          if (contract.type == 1){

            admin.database().ref("/account/" + fromAccountId + "/contracts/" + contractId.replace("/","_").replace("/","_")).set({"amount":amount,"toAccountId":toAccountId,"contractId":contractId, "valid":true, "price":contract.price}) //perde dinheiro ou ganha
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
    console.log("debito foi chamado");
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
            console.log("deu contrato pro ",toAccountId);
            admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId + "/" + fromAccountId + "/").set(amount) //ganha contratos
          }
        } else {



        }

        admin.database().ref("/account/" + toAccountId).once('value').then(function(snap) {
          if (contract.type == -1){
            admin.database().ref("/account/" + fromAccountId + "/contracts/" + validThru + "/" + contractId).set({"amount":amount,"toAccountId":toAccountId,"contractId":contractId, "valid":true, "price":contract.price}) //perde dinheiro ou ganha
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


  fromAccount = req.body.fromAccountId
  toAccount = req.body.toAccountId
  idContrato =req.body.contractId //     validate/opcao/strike
  idOrdem = req.body.orderId
  amount = req.body.amount
  console.log("-------------------------------------------")
  console.log(req.body)
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


app.post('/executar/direito/opcao', function(req, res) { //IMPORTANTE // TODO:
  dayPrice = req.body.dayPrice


  contractId = req.body.contractId

  accountId = req.body.accountId

  dayPrice = 6

  console.log(req.body);

  executarOrdem(dayPrice,contractId,accountId).then((resp)=> {console.log(resp)} )
  res.send("OK")

})

app.post('/registrar/operacao', (req, res) => {
  fdata = {}
  fdata.amount = req.body.amount
  fdata.contractId = req.body.contractId
  fdata.dateTime = Date.now()
  fdata.fromAccountId = req.body.fromAccountId
  fdata.price = req.body.price
  fdata.toAccountId = req.body.toAccountId
  fdata.type = req.body.type
  logOrder({fdata})
})


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
