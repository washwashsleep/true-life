var peer, localCall = null;
var myId = 'u' + (window.userId || '') + 'peer' + parseInt(Math.random() * 1e7, 10);

var peer = new Peer(myId, {
    host: 'localhost',
    port: 9001,
    path: '/myapp'
});

// peer = new Peer(myId, {
//     host: 'localhost',
//     port: 9000,
//     path: '/myapp'
// });

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

    if (localCall) {
        console.log('已有連線, 關閉連結');
        call.close();
        return false;
    }

    console.log('on call', call);
    localCall = call;
    setCallOn(myId);
    setCallOn(call.peer);

    call.answer(window.localStream);

    call.on('stream', function(stream) {
        console.log('call on steam');
        $(".buttononpeer").hide();
        $('#their-video').prop('src', URL.createObjectURL(stream));
        setTimeout(function() {
            $(".select-box").slideDown();
        }, 3000);
    });

    //Firefox does not yet support this event.
    call.on('close', function() {
        console.log('call on close');
        localCall = null;
        setCallOff(myId);
        setCallOff(call.peer);
    });

    call.on('error', function(e) {
        console.log('call on error', e);
    });

});



navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

function getMyStream() {

    navigator.getUserMedia({
        audio: false,
        video: true
    }, function(stream) {
        $('.cover').hide();
        console.log('取回相機stream', stream);
        $('#my-video').prop('src', URL.createObjectURL(stream));

        window.localStream = stream;
    }, function() {
        console.log('error');
    });
}

function tryConnect(theirId) {

    if (localCall) {
        localCall.close();
    }

    console.log('嘗試與 %s 建立連線', theirId);

    var conn = peer.connect(theirId);
    var call = peer.call(theirId, window.localStream);

    if (!call) {
        return alert('連線錯誤');
    }

    localCall = call;

    call.on('stream', function(stream) {
        console.log('call on stream');
        $(".buttononpeer").hide();
        setTimeout(function() {
            $(".select-box").slideDown();
        }, 3000);
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });
}

function getPeer() {
    $(".buttononpeer").attr("disabled", true);
    $.ajax('/userPeer').done(function(data) {
        if (!data) {
            // location.href = '/start';
            alert('您沒有配對到唷～請重新再一發吧！');
            $(".buttononpeer").attr("disabled", false);
            return console.log('發生錯誤請重新整理');
        }

        // TODO 因為後端不知道 peerId 所以偷懶，
        // TODO 這邊要判斷是不是拿到自己的，如果是的話要重試幾次確認是否真的沒有別人 ＴＴ
        if (data == myId) {
            console.log('拿到自己id');
            alert('您沒有配對到唷～請重新再一發吧！');
            $(".buttononpeer").attr("disabled", false);

        } else {
            console.log('data', data);
            tryConnect(data);


        }

    });
}

function postReports(target) {
    target.data.userId = localCall.peer.substr(1, 24);
    $.post("/reports", target.data).done(function(data) {
            console.log(data);
            alert('放心！我會為你報仇的！');
            location.href = '/';
        })
        .fail(function(data) {
            console.log(data);
            alert("資料庫可能被Simon攻擊, 馬上為您修復！");
            location.href = '/';
        });
}


function postSelect(target) {
    target.data.userId = localCall.peer.substr(1, 24);
    $.post("/likes", target.data).done(function(data) {
            console.log(data);
            alert('祝你有個好結果');
            location.href = '/';
        })
        .fail(function(data) {
            console.log(data);
            alert("資料庫可能被Simon攻擊, 馬上為您修復！");
            location.href = '/';
        });
}

function setCallOn(id) {
    $.ajax('/callOn/' + id);
}

function setCallOff(id) {
    $.ajax('callOff/' + id);
}

var dialog = function(title, messages) {

};

$(document).ready(function() {

    $('#myId').html(myId);
    $('[data-toggle="tooltip"]').tooltip();
    $('#like').on('click', {
        userId: '',
        like: 1
    }, postSelect);
    $('#unlike').on('click', {
        userId: '',
        unlike: 1
    }, postSelect);
    $('#bad').on('click', {
        userId: ''
    }, postReports);
    $(".buttononpeer").click(function() {
        getPeer();
    });

    // 取得相機權限
    getMyStream();

});