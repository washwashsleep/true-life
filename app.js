var express = require('express');
global.app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('cookie-session');

var userPeers = require('./userPeers');

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
  userPeers.add(id);
  console.log('new connection, id is : %s', id);
  userPeers.show();
});

expresspeerserver.on('disconnect', function (id) {
  userPeers.remove(id);
  console.log('peer disconnect, : %s', id);
  userPeers.show();
});


app.use('/myapp', expresspeerserver);


/*
 * api
 */
var controllers = require('./controllers');

app.get('/', controllers.root.home);
app.get('/index', controllers.root.home);
app.get('/start', controllers.root.start);
app.get('/scheduling', controllers.root.scheduling)

// 註冊
app.post('/users', controllers.users.create);

// 登入
app.post('/login', controllers.users.login);
// 登出
app.get('/logout', controllers.users.logout);

// 檢舉
app.post('/reports', controllers.users.report);

// 人氣列表
app.get('/hots', controllers.users.hot);

app.get('/userPeer', controllers.userPeers.getPeer);
app.get('/callOn/:peerId', controllers.userPeers.callOn);
app.get('/callOff/:peerId', controllers.userPeers.callOff);

// 喜歡或不喜歡
app.post('/likes', controllers.likes.create);


server.listen(9000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
