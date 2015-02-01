var async = require('async');
var models = require('../../models');
var _ = require('lodash');

module.exports = function (req, res){
    async.waterfall([
        function checkLogin(cb){
            if(!req.session.user){
                console.log('找不到 req.session.user');
                return res.redirect('/');
            }

            cb();
        },

        function pickFields(cb){

            var options = _.pick(req.body, 'userId', 'like', 'unlike');

            cb(null, options);
        },

        function validateFields(options, cb){

            if(!options.userId){
                console.log('req.body 找不到 user id');
                return res.redirect('/');
            }

            cb(null, options);
        },

        function insert(options, cb){
            models.likes.insert({
                user: options.userId,
                type: options.like ? 'like' : 'unlike',
                creater: req.session.user.id
            }, cb);
        }
    ], function (err, newLike){
        if(err){
            return res.send(err);
        }

        if(!newLike){
            return res.send(new Error('無法創建個人喜好'));
        }

        res.redirect('/');
    });
};