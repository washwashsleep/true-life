module.exports = function (req, res){

    if(!req.session.user){
        console.log('沒有登入，找不到 res.session.user');
        //return res.redirect('/');
    }

    res.render('start.html');
};