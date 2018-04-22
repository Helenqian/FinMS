var router = require('express').Router();
var User = require('../models/user');
var async = require('async');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');


router.get('/header', function (req, res, next) {
	if (!(req.body.headercode || req.body.headername)) {
		Header.find({}, function (err, headers) {
			if (err) return next(err);
			res.render('document/header',
				{
					headers: headers, message: req.flash('message')
				});
		});
	} else {
		res.render('document/header',
			{
				headers: req.headers, message: req.flash('message')
			});
	}
});

<<<<<<< HEAD
router.post('/header', function(req, res, next) {

 	if(!(req.body.headercode || req.body.headername)){
 		 Header.find({}, function(err, headers){
 		  if (err) return next(err);
 		  res.render('document/header', 
		   { headers: headers, message: req.flash('message')
 			 });
		 });
	 } 

 	else if(!req.body.headercode){
 	  Header.find({name: req.body.headername}, function(err, headers){
  		 if (err) return next(err);
  		 if(!headers){
 		  req.flash('message', 'No header has been found');
		   return res.redirect('/header');
  		  } else {
  		  res.render('document/header', {headers: headers, message: req.flash('success')});
 	   }
 	 });
 }
 	else if(!req.body.headername){
  		Header.find({ code: req.body.headercode}, function(err, headers){
  		 if (err) return next(err);
  		 if(!headers){
  			 req.flash('message', 'No header has been found');
  			 return res.redirect('/header');
   		 } else {
   		 res.render('document/header', {headers: headers, message: req.flash('success')});
   	 }
  });
 }
 	else{
 		 Header.find({ code: req.body.headercode, name: req.body.headername}, function(err, headers){
  		 if (err) return next(err);
  		 if(!headers){
  			 req.flash('message', 'No header has been found');
   			return res.redirect('/header');
  		  } else {
  		  res.render('document/header', {headers: headers, message: req.flash('success')});
	  	  }
  	});
 }
=======
router.get('/api/header', function (req, res, next) {
	Header.find({}, function (err, headers) {
		if (err) return next(err);
		res.type = 'application/json';
		res.send({ headers: headers });
	});
>>>>>>> f34aa2308d32f68923f7c54269fb7f8a74ba8cd4
});

router.post('/header', function (req, res, next) {

	if (!(req.body.headercode || req.body.headername)) {
		Header.find({}, function (err, headers) {
			if (err) return next(err);
			res.render('document/header',
				{
					headers: headers, message: req.flash('message')
				});
		});
	}

	else if (!req.body.headercode) {
		Header.find({ name: req.body.headername },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					req.flash('message', 'No header has been found');
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers, message: req.flash('success') });
				}
			});
	}
	else if (!req.body.headername) {
		Header.find({ code: req.body.headercode },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					req.flash('message', 'No header has been found');
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers, message: req.flash('success') });
				}
			});
	}
	else {
		Header.find({ code: req.body.headercode, name: req.body.headername },
			function (err, headers) {
				if (err) return next(err);
				if (!headers) {
					req.flash('message', 'No header has been found');
					return res.redirect('/header');
				} else {
					res.render('document/header', { headers: headers, message: req.flash('success') });
				}
			});
	}
});

<<<<<<< HEAD
router.post('/addheader', function(req, res, next) {
	
//	async.waterfall([
//		function(callback) {
			var header = new Header();
	
			header.code = req.body.headercode;
			header.name = req.body.headername;

			Header.findOne({ code: req.body.headercode }, function(err, existingHeader){

				if(existingHeader){
					//console.log(req.body.email + " is already exist");
					req.flash('message', 'Header with that code already exists');
					//res.json('Header with that code already exists');
					return res.redirect('/addheader');
			  } else {
				header.save(function(err, header){
				 if(err) return next(err);
				 //req.flash('message', 'New header has been created');
				 //res.json('New header has been created');
				 return res.redirect('/addheader');
				 //callback(null, header);
				});
			}
		});
//	},
=======
>>>>>>> f34aa2308d32f68923f7c54269fb7f8a74ba8cd4


router.get('/addheader', function (req, res, next) {
	res.render('document/addheader', { message: req.flash('message') });
});

router.post('/addheader', function (req, res, next) {

	//	async.waterfall([
	//		function(callback) {
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
				//				 callback(null, header);
			});
		}
	});
	//	},

	//	function(header){
	//		req.flash('success', 'New header has been created');
	//		res.redirect('/addheader');
	//	}
	//	]);
});


router.delete('/header', function(req, res, next){

	Header.findOne({code: req.body.headercode}, function(err, toDeleteHeader){
		if(!toDeleteHeader){
			req.flash('delete failed', 'Header does not exist');
			return res.redirect('/header');
		} else {
			Header.remove({ _id: toDeleteHeader._id }, function(err){
				if(err) return next(err);
				res.redirect('/header');
			});
		}
	});
});


router.get('/accountdocument', function (req, res, next) {
	res.render('document/accountdocument', {
		errors: req.flash('errors')
	});
});



router.get('/account', function (req, res, next) {
	Account.find({}, function (err, accounts) {
		if (err) return next(err);
		res.render('document/account',
			{
				accounts: accounts, message: req.flash('message')
			});
	});
});


router.post('/account', function (req, res, next) {

	var account = new Account();

	account.code = req.body.accountcode;
	account.name = req.body.accountname;

	Account.find({ code: req.body.code, name: req.body.name }, function (err, existingAccount) {

		if (existingAccount) {
			req.flash('errors', 'Account already exists');
			return res.redirect('/account');
		} else {
			res.redirect('/account');
		}
	});
});

router.get('/list', function (req, res, next) {
	res.render('document/list', {
		errors: req.flash('errors')
	});
});

router.get('/crud', function (req, res, next) {
	res.render('document/crud', {
		errors: req.flash('errors')
	});
});


module.exports = router;