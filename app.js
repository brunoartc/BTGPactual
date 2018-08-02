const express = require('express');
const app = express();
const path = require('path');
var cookieParser = require('cookie-parser');

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

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

  admin.database().ref('/contracts/' + fdata.strike).set(fdata)
  res.send("Contrato cadastrado com sucesso")
}); //OKK


app.get('/contratos', function(req, res) {
  admin.database().ref("/contracts").once('value', function(snapshot) {
    res.send(snapshot.val())
  });
}); //OKK

app.post('/contratos/ordens/cadastrar', function(req, res) {
  var fdata = {}
  //TODO assinar contrato com assinatura digital
  fdata.contractId = req.body.contractId
  fdata.accountId = req.body.accountId
  fdata.price = req.body.price
  fdata.amount = req.body.amount
  fdata.type = req.body.type
  admin.database().ref('/contracts/' + req.body.contractId + '/orders/').push(fdata)
  res.send("Ordem cadastrado com sucesso")
});



app.get('/contratos/ordens/', function(req, res) {
  admin.database().ref('/contracts/' + req.body.contractId + '/orders').once('value', function(snapshot) {
    var response = {};
    response = snapshot.val()
    for (var i in response) {
      response[i].total = parseFloat(response[i].amount) * parseFloat(response[i].price)
    }
    res.send(response)
  });
});



function infoFromContract(contractId, id, amount) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/orders/").child(id).once('value').then(function(snap) {
      if (snap.val().amount >= amount) {
        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}




function buyFromContract(contractId, id, amount) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/orders/").child(id).once('value').then(function(snap) {
      console.log(12321123123, snap.val().amount);
      if (snap.val().amount >= amount) {
        admin.database().ref("/contracts/" + contractId + "/orders/" + id).child("amount").set(snap.val().amount - amount)

        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}


function creditFromContract(contractId, fromAccountId, toAccountId, amount, type, price) {
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child(toAccountId).once('value').then(function(snap) {
      if (1 == 1) {
        if (type == -1){
          //TODO cria contrato ordem
          console.log("type -1");
        } else {
          if (snap.val()!=null) {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child(toAccountId).set(snap.val() + type * amount) //ganha contratos
          } else {
            admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId + "/" + toAccountId + "/").set(type * amount) //ganha contratos
          }


        }

        admin.database().ref("/account/").child(fromAccountId).once('value').then(function(snap) {
          admin.database().ref("/account/" + fromAccountId).child("money").set(snap.val().money - type * amount * price) //perde dinheiro ou ganha

        })
        //




        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}











//
// function debitFromContract(contractId, toAccountId, amount, type, price) {
//   console.log(" aqui o teste/account/" + toAccountId);
//   return new Promise(function(resolve, reject) {
//     admin.database().ref("/account").child(toAccountId).once('value').then(function(snap) {
//       console.log(12321123123, snap.val(), type, amount, price);
//       if (1 <= 1) {
//         admin.database().ref("/account/" + toAccountId).child("money").set(snap.val().money + type * amount * price) //ganha dinheiro ou perde
//
//         return resolve("Transacao concluida")
//       } else {
//         return reject("Transacao nao concluida")
//       }
//     });
//   })
// }


function debitFromContract(contractId, fromAccountId, toAccountId, amount, type, price) {
  return new Promise(function(resolve, reject) {
    console.log("debito foi chamado");
    admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId).child(fromAccountId).once('value').then(function(snap) {
      if (1 == 1) {
        if (type == -1){
          //TODO cria contrato ordem
          console.log("cria contrato");
          if (snap.val()!=null) {


            admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId).child(fromAccountId).set(snap.val() + amount) //ganha contratos
          } else {
            admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId + "/" + fromAccountId + "/").set(amount) //ganha contratos
          }
        } else {



        }

        admin.database().ref("/account/").child(toAccountId).once('value').then(function(snap) {
          admin.database().ref("/account/" + toAccountId).child("money").set(snap.val().money + type * amount * price) //perde dinheiro ou ganha

        })
        //




        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}








app.post('/contratos/ordem/executar', function(req, res) {
  var fdata = {}
  fdata.fromUserId = req.body.fromUserId
  fdata.toUserId = req.body.toUserId
  fdata.orderId = req.body.orderId
  fdata.amount = req.body.amount

  buyFromContract(req.body.orderId, req.body.amount).then().catch()


  admin.database().ref('/contracts').push(fdata)
  res.send("Contrato cadastrado com sucesso")
});




app.get('/cte', function(req, res) {
  fromAccount = 2
  toAccount = 1
  idContrato = "3BRL80"
  idOrdem = "-LIuKR4Exv6W_pQDxGgc"
  amount = 1
  // type -1 = venda
  buyFromContract(idContrato, idOrdem, amount).then(function(snap) {
    debitFromContract(idContrato, fromAccount, toAccount, amount, snap.type, snap.price).then(console.log("debitou")).catch(console.log(456))
    creditFromContract(idContrato, fromAccount, toAccount, amount, snap.type, snap.price).then(console.log("creditou")).catch(console.log(456))
    //TODO Registar ordens finalizadas no banco de dados em /statement/orders
  }).catch(console.log(456))
  res.send("Contrato cadastrado com sucesso")
});






app.listen(process.env.PORT || 4000, function() {
  console.log('Example app listening on port 4001!');
});
