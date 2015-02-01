
var peer, localCall = null;
var myId = 'peer' + parseInt( Math.random()*1e7 , 10);

// var peer = new Peer(myId, {host: '128.199.223.114', port: 3344, path: '/myapp'});
peer = new Peer(myId, {
	host: 'localhost',
	port: 9000,
	path: '/myapp'
});

// 與伺服器建立 peer 連線成功
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

// 當有人跟我連線的事件
peer.on('connection', function(conn) {
    console.log('on connection');

    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
    });
});

// 當有人呼叫我通話
peer.on('call', function(call) {

  if(localCall){
    console.log('已有連線, 關閉連結');
    call.close();
    return false;
  }

  localCall = call;

    call.answer(window.localStream);

    call.on('stream', function(stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    //Firefox does not yet support this event.
    call.on('close', function(){
      localCall = null;
    });

});



navigator.getUserMedia =  navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function getMyStream () {

    navigator.getUserMedia({audio: true, video: true}, function (stream) {
        $('.cover').hide();
        $(".select-box").slideDown();
        console.log(stream);
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;

    }, function(){
        console.log('error');
    });
}

function tryConnect(theirId) {

    console.log('嘗試與 %s 建立連線', theirId);

    var conn = peer.connect(theirId);
    var call = peer.call(theirId, window.localStream);

    if (!call) {
        return alert('連線錯誤');
    }

    call.on('stream', function(stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });
}


$(document).ready(function() {

    $('.cover').hide();
    $(".select-box").slideDown();
    $('#myId').html(myId);

    // 取得相機權限
    getMyStream();

    // 綁定連線按鈕
    $('#btn-connect').on('click', function(){
        tryConnect( $('#theirId').val() );
    });
});
