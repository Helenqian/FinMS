var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/Initial');

router.get('/balancesheet', function(req, res, next){
    res.render('sheet/balance');
});

module.exports = router;