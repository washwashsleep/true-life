
var _ = require('lodash');

var peers = {};


module.exports = {

	add: function (id) {
    peers[id] = {
      id: id,
      isOnCall: false
    };
	},

	remove: function (id) {
		delete peers[id];
		return ;
	},

  callOn: function (id){
    peers[id] && (peers[id].isOnCall = true);
  },

  callOff: function(id){
    peers[id] && (peers[id].isOnCall = false);
  },

	show: function () {
		console.log( this.getPeers() );
  },

  getPeers: function(){
    return _.pluck( this._getPeerAvailable(), 'id');
  },

  _getPeerAvailable: function(){
    return _.filter(peers, function (peer) {
      return peer.isOnCall === false;
    });
  }
};
