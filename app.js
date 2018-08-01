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

  admin.database().ref('/contracts').push(fdata)
  res.send("Contrato cadastrado com sucesso")
}); //OKK


app.get('/contratos', function(req, res) {
  admin.database().ref("/contracts").once('value', function(snapshot) {
    res.send(snapshot.val())
  });
}); //OKK

app.post('/contratos/ordens/cadastrar', function(req, res) {
  var fdata = {}

  fdata.contractId = req.body.contractId
  fdata.accountId = req.body.accountId
  fdata.price = req.body.price
  fdata.amount = req.body.amount
  fdata.type = req.body.type
  admin.database().ref('/contracts/' + req.body.contractId + '/orders').push(fdata)
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
      //console.log(12321123123, snap.val().amount);
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
      //console.log(12321123123, snap.val().amount);
      if (snap.val().amount >= amount) {
        admin.database().ref("/contracts/" + contractId + "/orders/" + id).child("amount").set(snap.val().amount + snap.val().type * amount)
        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}


function creditFromContract(contractId, fromAccountId, amount, type) {
  return new Promise(function(resolve, reject) {
    console.log("/contracts/" + contractId + "/account/" + fromAccountId, type);
    admin.database().ref("/contracts/" + contractId + "/account/").child(fromAccountId).once('value').then(function(snap) {
      //console.log(12321123123, snap.val().amount);
      if (snap.val().amount >= amount) {
        admin.database().ref("/contracts/" + contractId + "/account/" + fromAccountId).child("amount").set(snap.val().amount + type * amount) //ganha contratos
        admin.database().ref("/account/" + fromAccountId).child("money").set(snap.val().amount - type * amount) //perde dinheiro

        


        return resolve(snap.val())
      } else {
        return reject("Transacao nao concluida")
      }
    });
  })
}

function debitFromContract(contractId, toAccountId, amount, type) {
  console.log("/contracts/" + contractId + "/account/" + toAccountId);
  return new Promise(function(resolve, reject) {
    admin.database().ref("/contracts/" + contractId + "/account/").child(toAccountId).once('value').then(function(snap) {
      //console.log(12321123123, snap.val().amount);
      if (snap.val().amount >= amount) {
        admin.database().ref("/contracts/" + contractId + "/account/" + toAccountId).child("amount").set(snap.val().amount - type * amount) //ganha dinheiro


        return resolve("Transacao concluida")
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
  infoFromContract(1, 1, 1).then(function(snap) {
    debitFromContract(1, 1, 1, snap.type).then(console.log("debitou")).catch(console.log(456))
    creditFromContract(1, 2, 1, snap.type).then(console.log(123)).catch(console.log(456))
  }).catch(console.log(456))
  //debitFromContract(1,1,1).then(console.log(123)).catch(console.log(456))
  //
  res.send("Contrato cadastrado com sucesso")
});






app.listen(process.env.PORT || 4000, function() {
  console.log('Example app listening on port 4001!');
});
