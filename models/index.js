var mongojs = require('mongojs'),
    db = mongojs('mongodb://127.0.0.1:27017/true_life'),
    users = db.collection('users'),
    likes = db.collection('likes'),
    reports = db.collection('reports');

module.exports = {
    users: users,
    likes: likes,
    reports: reports
};