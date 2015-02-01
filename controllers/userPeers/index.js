
var _ = require('lodash');
var userPeers = require('../../userPeers.js');

module.exports = {
  getPeer: function (req, res){
    res.json( _.sample(userPeers.getPeers()) || null);
  },

  callOn: function (req, res){
    userPeers.callOn(req.params.peerId);
    return res.json({status: 'ok'});
  },

  callOff: function (req, res){
    userPeers.callOff(req.params.peerId);
    return res.json({status: 'ok'});
  }

};
