var router = require('express').Router();
var User = require('../models/user');
var async = require('async');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');


router.get('/header', function (req, res, next) {
	if (!(req.body.headercode || req.body.headername)) {
		Header.find({}, 'code name', function (err, headers) {
			if (err) return next(err);
			res.render('document/header',
				{
					headers: headers, message: req.flash('message')
				});
			});
			} 
			else {
			res.render('document/header',
			{
				headers: req.headers, message: req.flash('message')
			});
	}
});



router.get('/tablereload', function (req, res, next) {
	res.render('document/tableReload');
});

/*
router.get('/api/header', function(req,res,next){
	
	Header.find({}, 'code name',
	function (err, headers) {
		if (err) return next(err);
		var data =[];
		var _page = req.query.page;
		var _limit = req.query.limit;
		for (var j = (_page - 1) * _limit ; j < _page * _limit && (headers[j] != null); j++)
		{
			var o = {};
			o.code  = headers[j].code;
			o.name = headers[j].name;
			data.push(o);
		}
		var responsedata = {
		code: 0,
		msg: "",
		count: headers.length,
		data: data
		  } 
		res.send(responsedata);
	});
});
*/


router.get('/api/header', function (req, res, next) {
	if (!(req.query.headercode || req.query.headername)) {
		Header.find({}, 'code name', function (err, headers) {
				if (err) return next(err);
				var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				console.log("1"); 
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (headers[j] != null); j++)
				{
					var o = {};
					o.code  = headers[j].code;
					o.name = headers[j].name;
					data.push(o);
				}
				var responsedata = {
				code: 0,
				msg: "",
				count: headers.length,
				data: data
				  } 
				res.send(responsedata);
			});
	}
	else if (!req.query.headercode) {
		Header.find({ name: req.query.headername }, 'code name',
			function (err, headers) {
				if (err) return next(err);
				var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				console.log("2"); 
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (headers[j] != null); j++)
				{
					var o = {};
					o.code  = headers[j].code;
					o.name = headers[j].name;
					data.push(o);
				}
				var responsedata = {
				code: 0,
				msg: "",
				count: headers.length,
				data: data
				  } 
				res.send(responsedata);
			});
	}
	else if (!req.query.headername) {
		Header.find({ code: req.query.headercode }, 'code name',
			function (err, headers) {
				if (err) return next(err);
				var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				console.log("3");
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (headers[j] != null); j++)
				{
					var o = {};
					o.code  = headers[j].code;
					o.name = headers[j].name;
					data.push(o);
				}
				var responsedata = {
				code: 0,
				msg: "",
				count: headers.length,
				data: data
				  } 
				res.send(responsedata);
			});
	}
	else {
		Header.find({ code: req.query.headercode, name: req.query.headername }, 'code name',
			function (err, headers) {
				if (err) return next(err);
				var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				console.log("4");
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (headers[j] != null); j++)
				{
					var o = {};
					o.code  = headers[j].code;
					o.name = headers[j].name;
					data.push(o);
				}
				var responsedata = {
				code: 0,
				msg: "",
				count: headers.length,
				data: data
				  } 
				res.send(responsedata);
			});
	}
});




router.post('/header', function (req, res, next) {

	if (!(req.body.headercode || req.body.headername)) {
		Header.find({}, function (err, headers) {
			if (err) return next(err);
			res.render('document/header',
				{
					headers: headers
				});
		});
	}

	else if (!req.body.headercode) {
		Header.find({ name: req.body.headername },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers});
				}
			});
	}
	else if (!req.body.headername) {
		Header.find({ code: req.body.headercode },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers });
				}
			});
	}
	else {
		Header.find({ code: req.body.headercode, name: req.body.headername },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers });
				}
			});
	}
});




router.post('/addheader', function(req, res, next) {
	
			var header = new Header();
	
			header.code = req.body.headercode;
			header.name = req.body.headername;

			Header.findOne({ code: req.body.headercode }, function(err, existingHeader){

				if(existingHeader){
					//console.log(req.body.email + " is already exist");
					req.flash('message', 'Header with that code already exists');
					return res.redirect('/addheader');
			  } else {
				header.save(function(err, header){
				 if(err) return next(err);
				 req.flash('message', 'New header has been created');
				 return res.redirect('/addheader');
				});
			}
		});
	});



router.get('/addheader', function (req, res, next) {
	res.render('document/addheader', { message: req.flash('message') });
});


router.post('/addheader', function (req, res, next) {

	var header = new Header();

	header.code = req.body.headercode;
	header.name = req.body.headername;

	Header.findOne({ code: req.body.headercode }, function (err, existingHeader) {

		if (existingHeader) {
			//console.log(req.body.email + " is already exist");
			req.flash('message', 'Header with that code already exists');
			//res.json('Header with that code already exists');
			return res.redirect('/addheader');
		} else {
			header.save(function (err, header) {
				if (err) return next(err);
				//req.flash('message', 'New header has been created');
				//res.json('New header has been created');
				return res.redirect('/addheader');
			});
		}
	});
});


router.post('/deleteheader', function(req, res, next){
	console.log("in post " + req.body.headercode);
	Header.findOne({code: req.body.headercode}, function(err, toDeleteHeader){
		if(!toDeleteHeader){
			console.log("not exist");
			console.log('delete failed', 'Header does not exist');
			return res.redirect('/header');
		} else {
			Header.remove({ _id: toDeleteHeader._id }, function(err){
				if(err) return next(err);
				console.log("already delete");
				return res.redirect('/header');
			});
		}
	});
});

router.post('/delallheader',function(req, res, next){
	console.log("in post " + req.body.datas[0].code);
	for(var i = 0; i < req.body.datas.length; i++){
	Header.findOne({code: req.body.datas[i].code, name: req.body.datas[i].name}, function(err, toDeleteHeader){
		if(!toDeleteHeader){
			console.log('delete failed', 'Header does not exist');
		} else {
			Header.remove({ _id: toDeleteHeader._id }, function(err){
				if(err) return next(err);
				console.log("already delete" + toDeleteHeader.code);
			});
		}
	});
	}
	res.redirect('/tableReload');
});



router.get('/accountdocument', function(req, res, next){

	res.render('document/accountdocument', {
		errors: req.flash('errors')
	});
});






module.exports = router;