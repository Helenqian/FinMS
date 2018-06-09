var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');

router.get('/manageuser', function (req, res, next) {
	if(!req.user) res.redirect('/login');
	User.findOne({ _id: req.user._id }, function(err, user){
		if (err) return next(err);
		if(user.usertype != "超级管理员") res.redirect('/noauthority');
        else {res.render('users/manageuser', 
        { user: user});}
	});
});

router.get('/api/user', function (req, res, next) {
	let option ={};
	if(req.query.email) {option.email=req.query.email;}
	if(req.query.name) {option.name=req.query.name;}
	if(req.query.usertype) {option.usertype=req.query.usertype;}
    User.find(option, function (err, users) {
			    if (err) return next(err);
			    var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (users[j] != null); j++)
				{
					var o = {};
					o.email  = users[j].email;
                    o.name = users[j].name;
                    o.address = users[j].address;
                    o.usertype = users[j].usertype;
					data.push(o);
				}
				var responsedata = {
				code: 0,
				msg: "",
				count: data.length,
				data: data
				  } 
				res.send(responsedata);
	});
});

router.get('/adduser', function(req,res,next){
	res.render('users/adduser', {
		errors: req.flash('errors')
	});
});

router.post('/adduser', function(req, res, next) {
	var user = new User();
	
	user.name = req.body.name;
	user.password = req.body.password;
	user.email = req.body.email;
	user.address = req.body.address;
	user.usertype = req.body.usertype;

	User.findOne({ email: req.body.email }, function(err, existingUser){

		if(existingUser){
			//console.log(req.body.email + " is already exist");
			req.flash('errors', 'Account with that email address already exists');
			return res.redirect('/adduser');
		} else {
			user.save(function(err, user){
				if(err) return next(err);
				
				//res.json("New user has been created");
				/*
				req.logIn(user, function(err){
					if (err) return next(err);
					res.redirect('/regime');
				});
				*/
			});
		}// mongoose func: find only one document in user database
	});
});

router.post('/deleteuser', function(req, res, next){
	User.findOne({email: req.body.demail}, function(err, toDeleteUser){
		if(!toDeleteUser){
			console.log("not exist");
			console.log('delete failed', 'Header does not exist');
			return res.redirect('/manageuser');
		} else {
			User.remove({ _id: toDeleteUser._id }, function(err){
				if(err) return next(err);
				console.log("already delete");
				return res.redirect('/manageuser');
			});
		}
	});
});

router.post('/delalluser',function(req, res, next){
	console.log("in post " + req.body.datas[0].code);
	for(var i = 0; i < req.body.datas.length; i++){
	User.findOne({email: req.body.datas[i].email, name: req.body.datas[i].name}, function(err, toDeleteUser){
		if(!toDeleteUser){
			console.log('delete failed', 'Header does not exist');
		} else {
			User.remove({ _id: toDeleteUser._id }, function(err){
				if(err) return next(err);
				console.log("already delete" + toDeleteUser.name);
			});
		}
	});
	}
	res.redirect('/manageuser');
});

module.exports = router;