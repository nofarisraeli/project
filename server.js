var express = require('express');
var app = express();

var __dirname;


app.get('/', function (req, res) {
  res.send('Hello World!')
})


app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/home.html');
})

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

//node server.js