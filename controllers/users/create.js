var async = require('async');
var models = require('../../models');
var _ = require('lodash');


module.exports = function (req, res){
    async.waterfall([
        function (cb){
            models.users.findOne({ email: req.body.email }, cb);
        },

        function (user, cb){
            if(user){
                return cb(new Error('email 已經存在'));
            }

            var options = _.pick(req.body, 'email', 'name', 'fb', 'line', 'sex');

            models.users.insert(options, cb);
        }
    ], function (err, newUser){
        if(err){
            return err;
        }

        res.json(newUser);
    });
};