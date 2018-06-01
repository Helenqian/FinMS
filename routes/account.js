var router = require('express').Router();
var User = require('../models/user');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');

router.get('/account', function (req, res, next) {
    res.render('document/account');
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

router.get('/addaccount', function (req, res, next) {
    res.render('document/addaccount', { message: req.flash('message') });
});



router.post('/addaccount', function(req, res, next) {
    var account = new Account();
    account.code = req.body.accountcode;
    account.name = req.body.accountname;
    account.type = req.body.accounttype;
    
    Account.findOne({ code: req.body.accountcode }, function(err, existingAccount){
        if(existingAccount){
          req.flash('message', 'Account with that code already exists');
          return res.redirect('/addaccount');
        } else {
          account.save(function(err, account){
          if(err) return next(err);
          req.flash('message', 'New account has been created');
          return res.redirect('/addaccount');
          });
       }
    });
});
    

router.get('/api/account', function (req, res, next) {
        if (!(req.query.accountcode || req.query.accountname)) {
            Account.find({}, 'code name type', function (err, accounts) {
                    if (err) return next(err);
                    var data =[];
                    var _page = req.query.page;
                    var _limit = req.query.limit;
                    console.log("1"); 
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accounts[j] != null); j++)
                    {
                        var o = {};
                        o.code  = accounts[j].code;
                        o.name = accounts[j].name;
                        o.type = accounts[j].type;
                        data.push(o);
                    }
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accounts.length,
                    data: data
                      } 
                    res.send(responsedata);
                });
        }
        else if (!req.query.accountcode) {
            Account.find({ name: req.query.accountname }, 'code name type',
                function (err, accounts) {
                    if (err) return next(err);
                    var data =[];
                    var _page = req.query.page;
                    var _limit = req.query.limit;
                    console.log("2"); 
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accounts[j] != null); j++)
                    {
                        var o = {};
                        o.code  = accounts[j].code;
                        o.name = accounts[j].name;
                        o.type = accounts[j].type;
                        data.push(o);
                    }
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accounts.length,
                    data: data
                      } 
                    res.send(responsedata);
                });
        }
        else if (!req.query.accountname) {
            Account.find({ code: req.query.accountcode }, 'code name type',
                function (err, accounts) {
                    if (err) return next(err);
                    var data =[];
                    var _page = req.query.page;
                    var _limit = req.query.limit;
                    console.log("3");
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accounts[j] != null); j++)
                    {
                        var o = {};
                        o.code  = accounts[j].code;
                        o.name = accounts[j].name;
                        o.type = accounts[j].type;
                        data.push(o);
                    }
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accounts.length,
                    data: data
                      } 
                    res.send(responsedata);
                });
        }
        else {
            Account.find({ code: req.query.accountcode, name: req.query.accountname }, 'code name type',
                function (err, accounts) {
                    if (err) return next(err);
                    var data =[];
                    var _page = req.query.page;
                    var _limit = req.query.limit;
                    console.log("4");
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accounts[j] != null); j++)
                    {
                        var o = {};
                        o.code  = accounts[j].code;
                        o.name = accounts[j].name;
                        o.type = accounts[j].type;
                        data.push(o);
                    }
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accounts.length,
                    data: data
                      } 
                    res.send(responsedata);
                });
        }
    });

    router.post('/deleteaccount', function(req, res, next){
        console.log("in post " + req.body.accountcode);
        Account.findOne({code: req.body.accountcode}, function(err, toDeleteAccount){
            if(!toDeleteAccount){
                console.log("not exist");
                console.log('delete failed', 'Account does not exist');
                return res.redirect('/account');
            } else {
                Account.remove({ _id: toDeleteAccount._id }, function(err){
                    if(err) return next(err);
                    console.log("Account already delete");
                    return res.redirect('/account');
                });
            }
        });
    });
    
    router.post('/delallaccount',function(req, res, next){
        console.log("in post " + req.body.datas[0].code);
        for(var i = 0; i < req.body.datas.length; i++){
        Account.findOne({code: req.body.datas[i].code, name: req.body.datas[i].name}, function(err, toDeleteAccount){
            if(!toDeleteAccount){
                console.log('delete failed', 'Account does not exist');
            } else {
                Account.remove({ _id: toDeleteAccount._id }, function(err){
                    if(err) return next(err);
                    console.log("Account already delete" + toDeleteAccount.code);
                });
            }
        });
        }
        res.redirect('/tableReload');
    });
    


    module.exports = router;
