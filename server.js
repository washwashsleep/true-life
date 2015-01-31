var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.get('/', function(req, res) {
    res.send('Hello World!');
});

var server = app.listen(3355, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
