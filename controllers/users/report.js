var async = require('async');
var models = require('../../models');
var _ = require('lodash');

module.exports = function (req, res){
    async.waterfall([
        function isLogin(cb){

            if(!req.session.user._id){
                return res.json({ error: new Error('尚未登入') });
            }

            if(!req.body.userId){
                return res.json({ error: new Error('沒有傳入 req.body.userId') });
            }

            cb();
        },

        function insert(cb){
            models.reports.insert({
                userId: req.body.userId,
                repoter: req.session.user._id,
            }, cb);
        }
    ], function (err, newReport){
        if(err){
            return res.json({ error: err });
        }

        if(!newReport){
            return res.json({ error: new Error('檢舉有問題') });
        }

        res.json({ data: newReport });
    });
};