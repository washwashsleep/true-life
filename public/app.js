angular.module('lifeTrue', [])
  .controller('baseCtrl', ['$scope', function($scope) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    $scope.theirId = null;
    $scope.myId = 'peer' + parseInt( Math.random()*1e7 , 10);
    $scope.videoSrc = null;
    peer = new Peer($scope.myId, {host: 'localhost', port: 9000, path: '/myapp'});

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
        angular.element('#their-video').prop('src', URL.createObjectURL(stream));
      });
    });

    $scope.getMyStream = function () {
      navigator.getUserMedia({audio: true, video: true}, function (stream) {
        // $scope.videoSrc = URL.createObjectURL(stream)
        angular.element('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
      }, function(){ 
        console.log('error');
      });
    }

    $scope.tryConnect = function (theirId) {
      console.log('嘗試與 %s 建立連線', theirId);
      var conn = peer.connect(theirId);
      var call = peer.call(theirId, window.localStream);

      if (!call) 
        return alert('連線錯誤');

      call.on('stream', function(stream) {
        angular.element('#their-video').prop('src', URL.createObjectURL(stream));
      });
    }

    angular.element(document).ready(function () {
      console.log('Hello World');
      $scope.getMyStream();
    });
  }]);