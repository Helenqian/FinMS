var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConf = require('../config/passport');

router.get('/manageuser', function (req, res, next) {
	res.render('users/manageuser');
});

router.get('/api/user', function (req, res, next) {
    User.find({}, function (err, users) {
			    if (err) return next(err);
			    var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (users[j] != null); j++)
				{
					var o = {};
					o.email  = users[j].email;
                    o.name = users[j].profile.name;
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


module.exports = router;