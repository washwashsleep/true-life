module.exports = function (req, res){
    if(!req.session.user){
        req.flash('info', '您尚未登入!');
        console.log('沒有登入，找不到 res.session.user');
        return res.redirect('/');
    }
    
    res.render('start.html', { userId: req.session.user._id });
};