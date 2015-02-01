
var _ = require('lodash');

var peers = {};


module.exports = {
	add: function (id) {
		peers[id] = true;
	},

	remove: function (id) {
		delete peers[id];
		return ;
	},

	show: function () {
		console.log(_.keys(peers));
	}
};
