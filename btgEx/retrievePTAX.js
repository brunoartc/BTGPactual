var url = 'https://economia.awesomeapi.com.br/all';

const https = require('https')

https.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var dolarPTAX = JSON.parse(body);
        console.log("Got a response: ", dolarPTAX["USD"]['high']);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});