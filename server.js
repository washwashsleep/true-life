
var express = require('express');
var app = express();
var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/myapp'});
var Users = [];

app.use(express.static(__dirname + '/public'));


server.on('connection', function(id) { 
  Users.push(id);
  console.log(Users);
});

app.get('/', function (req, res) {
  res.send('Hello World!');
})

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port)

})


