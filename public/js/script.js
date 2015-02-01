var myId = 'peer' + parseInt( Math.random()*1e7 , 10);
// var peer = new Peer(myId, {host: '128.199.223.114', port: 3344, path: '/myapp'});
var peer = new Peer(myId, {host: 'localhost', port: 9000, path: '/myapp'});
// var peer = new Peer(myId, {
//     key: 'j2qmsjunc7zdj9k9'
//     // host: 'localhost', port: 9000, path: '/myapp'
// }); 
$('.cover').hide();
$(".select-box").slideDown();
peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});


peer.on('connection', function(conn) {
    console.log('on connection');

    window.temp_conn = conn;

    conn.on('open', function() {
        // Receive messages
        conn.on('data', function(data) {
            console.log('Received', data);
        });

        // Send messages
        conn.send('Hello!');
    });
});


peer.on('call', function(call) {
    call.answer(window.localStream);

    call.on('stream', function(stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
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
    getMyStream();
    $('#myId').html(myId);

    $('#btn-connect').on('click', function(){
        tryConnect( $('#theirId').val() );
    });
});
