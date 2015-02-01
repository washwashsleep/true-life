module.exports = function (req, res){
    res.session.user = null;
    res.redirect('/');
};
