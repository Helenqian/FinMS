var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

// 进行序列化和反序列化，将数据结构转换为可存储的格式
passport.serializeUser(function(user, done){
	done(null, user._id);
});

passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

// Middleware
passport.use('local-login', new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
}, function(req, email, password, done){
	User.findOne({ email: email}, function(err,user){
		if (err) return done(err);
		console.log("in");
		if(!user) {
			return done(null, false, req.flash('loginMessage', '用户不存在'));
		}

		if(!user.comparePassword(password)) {
			return done(null, false, req.flash('loginMessage', 'Oops! 密码错误'));
		}
		return done(null, user);
	});	
}));

// custom function to validate
exports.isAuthenticated = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}