var async = require('async');
var models = require('../../models');
var _ = require('lodash');

module.exports = function (req, res){
    async.waterfall([
        function (cb){
            models.users.find().sort({ likeCount: -1 }, cb);
        }
    ], function (err, users){
        if(err){
            return res.json({ error: err });
        }

        res.json({ data: users });
    });
};