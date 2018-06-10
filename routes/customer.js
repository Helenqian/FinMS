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
	if(!req.user) res.redirect('/login');
	User.findOne({ _id: req.user._id }, function(err, user){
		if (err) return next(err);
		if((user.usertype != "业务员")&&(user.usertype != "超级管理员")) res.redirect('/noauthority');
        else {res.render('customer/customer', 
        { user: user, usertype: user.usertype});}
	});
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
	let option ={};
	if(req.query.name) {option.name = req.query.name;}
	if(req.query.salesman) {option.salesman = req.query.salesman;}
    Customer.find(option, function (err, customers) {
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

	router.post('/deletecustomer', function(req, res, next){
		Customer.findOne({email: req.body.email}, function(err, toDeleteCustomer){
			if(!toDeleteCustomer){
				console.log("not exist");
				console.log('delete failed', 'Header does not exist');
				return res.redirect('/customer');
			} else {
				Customer.remove({ _id: toDeleteCustomer._id }, function(err){
					if(err) return next(err);
					console.log("already delete");
					return res.redirect('/customer');
				});
			}
		});
	});

	router.post('/savecustomer', function(req, res, next){
		Customer.findOne({email: req.body.email}, function(err, customer){
			if(err) return next(err);
			console.log(customer);
			if(customer){
				customer.update({
               phone: req.body.phone
               ,company: req.body.company
               ,salesman: req.body.salesman
               ,address: req.body.address
               ,tradeinfo: req.body.tradeinfo
				}, function(err,result){
					if (err)
					return next(err);
					if (result)
					console.log(result);
				});
			}
		});
	});

	
	
module.exports = router;