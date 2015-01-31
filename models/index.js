var mongojs = require('mongojs'),
    db = mongojs('mongodb://128.199.223.114:27017/true_life'),
    users = db.collection('users');

module.exports = {
    users: users
};