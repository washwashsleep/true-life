var express = require('express');
var app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var users = [];

app.use(express.static(__dirname + '/public'));

var server = require('http').createServer(app);
var expresspeerserver = ExpressPeerServer(server, {debug: true});

expresspeerserver.on('connection', function (id) { 
    users.push(id);
    console.log('new connection, id is : %s', id);
});

app.use('/myapp', expresspeerserver);

app.get('/Qoo', function (req, res){
    res.json(users);
});

server.listen(9000, function (){
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});