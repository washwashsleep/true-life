module.exports = function (req, res){

    if(!req.session.user){
      //return res.redirect('/');
    }

    res.render('start.html');
};