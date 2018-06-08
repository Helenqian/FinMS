var router = require('express').Router();
var User = require('../models/user');
var Customer = require('../models/customer');

router.get('/', function(req, res){
	res.render('main/home');
});

router.get('/regime', function(req, res){
	res.render('document/regime');
});



router.get('/about', function(req, res){
	res.render('main/about');
});

module.exports = router;
