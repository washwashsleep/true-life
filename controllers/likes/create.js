var async = require('async');
var models = require('../../models');
var _ = require('lodash');
var mongojs = require('mongojs');

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
                creater: req.session.user._id
            }, cb);
        },

        function (newLike, status, cb){

            if(!newLike){
                return res.json({ error: new Error('找不到 like') });
            }

            var updateData;
            if(newLike.type === 'like'){
                updateData = {
                    $inc:{ likeCount : 1 }
                };
            }else {
                updateData = {
                    $inc:{ unlikeCount : 1 }
                };
            }

            models.users.update({
                _id: mongojs.ObjectId(newLike.user)
            }, updateData, function (err, status){
                if(err){
                    return res.json({error: err});
                }

                if(!status.ok){
                    return res.json({error: new Error('更新使用者失敗')});
                }

                cb(null, newLike);
            });
        },
    ], function (err, newLike){
        if(err){
            console.log(err);
            return res.json({ error: err });
        }

        if(!newLike){
            return res.json({ error: new Error('找不到 like') });
        }

        res.json({ data: newLike });
    });
};