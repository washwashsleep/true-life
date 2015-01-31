angular.module('lifeTrue', ['ui.bootstrap'])
  .controller('baseCtrl', ['$scope', function($scope) {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    $scope.theirId = null;
    $scope.myId = 'peer' + parseInt( Math.random()*1e7 , 10);
    $scope.videoSrc = null;
    var peer = new Peer($scope.myId, {host: '128.199.223.114', port: 3344, path: '/myapp'});

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
      navigator.getUserMedia({audio: false, video: true}, function (stream) {
        
        angular.element('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
      }, function(){
        console.log('error');
      });
    };

    $scope.tryConnect = function (theirId) {
      console.log('嘗試與 %s 建立連線', theirId);
      var conn = peer.connect(theirId);
      var call = peer.call(theirId, window.localStream);

      if (!call) 
        return alert('連線錯誤');

      call.on('stream', function(stream) {
        angular.element('#their-video').prop('src', URL.createObjectURL(stream));
      });
    };

    angular.element(document).ready(function () {
      console.log('Hello World');
      $scope.getMyStream();
    });
  }])
  .controller('ModalDemoCtrl', function ($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function (target) {
      switch (target) {
        case 'signUp':
          var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            title: '註冊',
            resolve: {
              body: function () {
                return {
                  title: '請註冊'
                }
              }
            }
          });
          break;  
        default: 
          var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
              body: function () {
                return {
                  title: '請登入',
                  email: true,
                  name: true,
                  sex: true,
                  fb: true,
                }
              }
            }
          });
      }

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  }).controller('ModalInstanceCtrl', function ($scope, $modalInstance, body) {

    $scope.body = body;
    // $scope.selected = {
    //   item: $scope.items[0]
    // };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });