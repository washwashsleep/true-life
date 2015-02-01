module.exports = function (req, res){
    res.render('index.html', { user: req.session.user });
};