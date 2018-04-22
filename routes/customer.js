var router = require('express').Router();
var Customer = require('../models/customer');
var Category = require('../models/category');
var User = require('../models/user');

router.get('/page', function (req, res, next) {
	User.findOne({ _id: req.user._id }, function (err, user) {
		if (err) return next(err);
		res.render('/page', { user: user });
	});
});

router.get('/addCustomer', function (req, res, next) {
	res.render('content/addCustomer', { message: req.flash('success') });
});


router.post('/addCustomer', function (req, res, next) {
	var customer = new Customer();

	//customer.category = req.body.category;
	customer.name = req.body.name;
	customer.email = req.body.email;
	customer.phone = req.body.phone;
	customer.address = req.body.address;
	//customer.sex = req.body.sex;
	customer.company = req.body.company;

	/*	customer.save(function(err){
			if(err) return next(err);
			req.flash('success', 'Successfully added a customer');
			return res.redirect('/')
		});*/

	Customer.findOne({ email: req.body.email }, function (err, existingCustomer) {

		if (existingCustomer) {
			req.flash('errors', 'Account with that email address already exists');
			return res.redirect('/addCustomer');
		} else {
			customer.save(function (err, customer) {
				if (err) return next(err);
				req.flash('success', 'Successfully added a customer');
				res.redirect('/addCustomer')
			});
		}
	});
});

/*router.get('/showCustomer', function(req, res, next){
	res.render('content/showCustomer', { message: req.flash('success')});
});

router.get('/showCustomer', function(req, res, next){
	Customer.findOne({ _id: req.customer._id }, function(err, customer){
		if (err) return next(err);
		res.render('cotent/showCustomer', { customer: customer});
	});
});*/


module.exports = router;