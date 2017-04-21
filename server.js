var express = require('express');
var app = express();

var __dirname;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


var handlebars = require('guarded-cliffs-30584')
  .create({ defaultLayout:'main' });

var server = app.listen(8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

//node server.js