var PeerServer = require('peer').PeerServer;
var server = PeerServer({
    port: 3344,
    path: '/myapp'
});
var Users = [];

server.on('connection', function(id) {
    Users.push(id);
    console.log('new connection, id is : %s', id);
});