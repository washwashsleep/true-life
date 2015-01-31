var express = require('express');
global.app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var users = [];

// view engine setup
app.engine('html', require('swig').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(require('path').join(__dirname, '/public')));
app.use(express.static(__dirname + '/bower_components'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  key: 'sessionId',
  secret: 'session_cookie_secret+sdjfiawe958723',
  cookie: {
    maxAge: 1000 * 60
  }
}));


var server = require('http').createServer(app);
var expresspeerserver = ExpressPeerServer(server, {
    debug: true
});

expresspeerserver.on('connection', function (id) {
    users.push(id);
    console.log('new connection, id is : %s', id);
});

app.use('/myapp', expresspeerserver);


/*
 * api 
 */
var controllers = require('./controllers');

// 註冊會員
app.get('/', controllers.root.home);
app.get('/index', controllers.root.home);
app.get('/start', controllers.root.start);
// app.post('/users', controllers.users.create);


server.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});