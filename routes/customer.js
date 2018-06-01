var router = require('express').Router();
var Customer = require('../models/customer');
//var Category = require('../models/category');
var User = require('../models/user');

router.get('/page', function (req, res, next) {
	User.findOne({ _id: req.user._id }, function (err, user) {
		if (err) return next(err);
		res.render('/page', { user: user });
	});
});

router.get('/customer', function (req, res, next) {
	res.render('customer/customer');
});

router.get('/addCustomer', function (req, res, next) {
	res.render('content/addCustomer', { message: req.flash('success') });
});


router.post('/addCustomer', function (req, res, next) {
	var customer = new Customer();

	customer.name = req.body.name;
	customer.email = req.body.email;
	customer.phone = req.body.phone;
	customer.address = req.body.address;
	customer.company = req.body.company;

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

router.get('/api/customer', function (req, res, next) {
    Customer.find({}, function (err, customers) {
			    if (err) return next(err);
			    var data =[];
				var _page = req.query.page;
				var _limit = req.query.limit;
				console.log("1"); 
				for (var j = (_page - 1) * _limit ; j < _page * _limit && (customers[j] != null); j++)
				{
					var o = {};
					o.email  = customers[j].email;
                    o.name = customers[j].name;
                    o.address = customers[j].address;
					o.sex = customers[j].sex;
					o.company = customers[j].company;
					o.phone = customers[j].phone;
					o.salesman = customers[j].salesman;
					o.tradeinfo = customers[j].tradeinfo;
					data.push(o);
				}
				console.log(data);
				var responsedata = {
				code: 0,
				msg: "",
				count: customers.length,
				data: data
				  } 
				res.send(responsedata);
			});
    });


module.exports = router;