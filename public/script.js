var myId = 'dca001';
var peer = new Peer(myId, {key: 'j2qmsjunc7zdj9k9'}); 

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
//

function getMyStream () {

    navigator.getUserMedia({audio: true, video: true}, function (stream) {
        
        console.log(stream);
        $('#my-video').prop('src', URL.createObjectURL(stream));
        
        window.localStream = stream;

    }, function(){ console.log('error'); });
}


$(document).ready(function() {
	getMyStream();
});
