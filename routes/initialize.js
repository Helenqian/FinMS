var router = require('express').Router();
var User = require('../models/user');
var async = require('async');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/initial');

router.get('/initial', function (req, res, next) {
    res.render('setting/initial');
});

router.post('/saveinitial', function (req, res, next) {
	
        var ini = new Initial();

        ini.startyear = req.body.startyear;
        ini.base = req.body.base;
        ini.currnum = req.body.base;

        Initial.find({}, function(err, existingINI){
            if(err) return next(err);
            if(existingINI){
                if(existingINI.length == 1){
                    Initial.remove({ _id: existingINI[0]._id }, function(err){
                    if(err) return next(err);
                    });
                }
                else if(existingINI.length > 1){
                    for(var i = 0; i < existingINI.length; i++){
                    Initial.remove({ _id: existingINI[i]._id }, function(err){
                        if(err) return next(err);
                    });
                    }
                }
            console.log("formal initials already delete");
            }
            ini.save(function(err, ini){
             if(err) return next(err);
             console.log('System has been initialized');
             return res.redirect('/initial');
            });
    });
});

router.get('/iniaccount', function (req, res, next) {
        res.render('document/iniaccount');
    });

module.exports = router;