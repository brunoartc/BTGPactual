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
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


app.post('/cadastrar/contrato', function (req, res) {
	var fdata = {}
  fdata.creationDate = Date.now()
	fdata.strike = req.body.strike
	fdata.validThru = req.body.validThru
	fdata.type = req.body.type

  console.log(fdata);
	admin.database().ref('/contracts').child(fdata.creationDate).set(fdata)
	res.send("Contrato cadastrado com sucesso")
});


app.listen(process.env.PORT || 4000, function () {
  console.log('Example app listening on port 4001!');
});
