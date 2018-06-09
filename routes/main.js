var router = require('express').Router();
var User = require('../models/user');
var Customer = require('../models/customer');

router.get('/', function(req, res){
	res.render('main/home');
});

router.get('/regime', function(req, res){
	if(!req.user) res.redirect('/login');
	User.findOne({ _id: req.user._id }, function(err, user){
		if (err) return next(err);
		res.render('document/regime', 
        { user: user, usertype: user.usertype});
	});
});



router.get('/about', function(req, res){
	res.render('main/about');
});

module.exports = router;
