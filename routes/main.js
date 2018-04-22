var router = require('express').Router();
var User = require('../models/user');
var Customer = require('../models/customer');

router.get('/', function(req, res){
	res.render('main/home');
})

router.get('/about', function(req, res){
	res.render('main/about');
})

module.exports = router;
