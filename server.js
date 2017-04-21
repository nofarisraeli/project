var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(express.static('./'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'index')))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})



var server = app.listen(process.env.PORT || 8000, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})

//node server.js