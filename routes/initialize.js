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
            Account.find({}, function(err, account){
            if(err) return next(err);
            for(var i = 0; i < account.length; i++){
            /* 初始化 将会计科目中所有历史额清空 */
            Account.update({ "_id" : account[i]._id}, { $pull : { month: { }}},function(err,result){  
                if (err) return console.error(err);  
                console.log(result);  
                }); 
            Account.update({ "_id" : account[i]._id}, { $pull : { year: { }}},function(err,result){  
                if (err) return console.error(err);   
                });  
            }
            for(var i = 0; i < account.length; i++){
            /* 将其实年份年初额初始化为零 */
            Account.update({_id: account[i]._id}, { $push : {month: {num: ini.startyear+"01",
                 startbln: "0.00"}}},function(err,result){  
                 if (err) return console.error(err);
             }); 
             Account.update({_id: account[i]._id}, { $push : {year: {num: ini.startyear,
                 startbln: "0.00"}}},function(err,result){  
                 if (err) return console.error(err);  
             });
            }
            });
             return res.redirect('/initial');
            });
    });
});

router.get('/iniaccount', function (req, res, next) {
        res.render('setting/iniacc');
    });

router.get('/saaaa', function(req,res,next){
    Initial.find({}, function(err,ini){
        Account.aggregate({ $match:{ year: {num: "0"}, month:{num: "01"}},
            $project: { _id : 1, month:1, year:1 }}).unwind('month').unwind('year').exec(function (err, accounts) {  
            if (err) return next(err);
            for (var j = 0; j < accounts.length; j++){
                            console.log(accounts[j].name);      
                            console.log(accounts[j].month.num);  
                            console.log(accounts[j].year.startbln);
            }
        
        });
});
});


router.get('/api/iniacc', function (req, res, next) {
        Initial.find({}, function(err,ini){
        if(err) return next(err);
        if (!(req.query.accountcode || req.query.accountname)) {
            Account.aggregate({$project: { _id : 1, month:1, year:1 } }).unwind('month').unwind('year').exec(function (err, accounts) {  
                if (err) return next(err);
                var data =[];
                var _page = req.query.page;
                var _limit = req.query.limit; 
                for (var j = (_page - 1) * _limit ; j < _page * _limit && j < accounts.length && (accounts[j].year.num == ini[0].startyear); j++){
                    var o = {};
                    o.code = accounts[j].code;
                    o.name = accounts[j].name;
                    o.type = accounts[j].type;
                    o.yearnum = accounts[j].year.num;
                    o.yearstartbln = accounts[j].year.startbln;
                    o.monthnum = accounts[j].month.num.substring(4,6);
                    o.monthstartlbn = accounts[j].month.startbln;
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
        Account.aggregate({$project: { _id : 1, month:1, year:1 } }).unwind('month').unwind('year').exec(function (err, accounts) {  
                if (err) return next(err);
                var data =[];
                var _page = req.query.page;
                var _limit = req.query.limit; 
                for (var j = (_page - 1) * _limit ; j < _page * _limit && j < accounts.length &&
                (accounts[j].year.num == ini[0].startyear); j++){
                    if(accounts[j].code == req.query.accountcode){
                    var o = {};
                    o.code = accounts[j].code;
                    o.name = accounts[j].name;
                    o.type = accounts[j].type;
                    o.yearnum = accounts[j].year.num;
                    o.yearstartbln = accounts[j].year.startbln;
                    o.monthnum = accounts[j].month.num.substring(4,6);
                    o.monthstartlbn = accounts[j].month.startbln;
                    data.push(o);
                    }
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
                Account.aggregate({$project: { _id : 1, month:1, year:1 } }).unwind('month').unwind('year').exec(function (err, accounts) {  
                if (err) return next(err);
                var data =[];
                var _page = req.query.page;
                var _limit = req.query.limit; 
                for (var j = (_page - 1) * _limit ; j < _page * _limit && j < accounts.length &&
                 (accounts[j].year.num == ini[0].startyear); j++){
                    if((accounts[j].name == req.query.accountname)){
                    var o = {};
                    o.code = accounts[j].code;
                    o.name = accounts[j].name;
                    o.type = accounts[j].type;
                    o.yearnum = accounts[j].year.num;
                    o.yearstartbln = accounts[j].year.startbln;
                    o.monthnum = accounts[j].month.num.substring(4,6);
                    o.monthstartlbn = accounts[j].month.startbln;
                    data.push(o);
                    }
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
                Account.aggregate({$project: { _id : 1, month:1, year:1 } }).unwind('month').unwind('year').exec(function (err, accounts) {  
                if (err) return next(err);
                var data =[];
                var _page = req.query.page;
                var _limit = req.query.limit; 
                for (var j = (_page - 1) * _limit ; j < _page * _limit && j < accounts.length
                && (accounts[j].year.num == ini[0].startyear); j++){
                    if((accounts[j].code == req.query.accountcode) && (accounts[j].name = req.query.accountname)){
                    var o = {};
                    o.code = accounts[j].code;
                    o.name = accounts[j].name;
                    o.type = accounts[j].type;
                    o.yearnum = accounts[j].year.num;
                    o.yearstartbln = accounts[j].year.startbln;
                    o.monthnum = accounts[j].month.num.substring(4,6);
                    o.monthstartlbn = accounts[j].month.startbln;
                    data.push(o);
                    }
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
});




router.post('/saveiniacc',function(req, res, next){
	console.log("save ini acc in post " + req.body.datas[0].code);
	for(var i = 0; i < req.body.datas.length; i++){
        Account.update(  
            {   
                 "code" : req.body.datas[i].code,  
                 "year.num" : req.body.datas[i].yearnum
            },  
            {  
                 $set: {  
                      "year.$" : {
                      "num" : req.body.datas[i].yearnum,
                      "startbln" : req.body.datas[i].yearstartbln 
                        }  
                       }  
            },function(err,result){  
              if (err) return console.error(err);  
              console.log(result);   
              });
        }
            for(var i = 0; i < req.body.datas.length; i++){
              Account.update(  
                {   
                     "code" : req.body.datas[i].code,  
                     "month.num" : req.body.datas[i].yearnum + req.body.datas[i].monthnum
                },  
                {  
                     $set: {
                          "month.$" : {
                          "num" : req.body.datas[i].yearnum + req.body.datas[i].monthnum,      
                          "startbln" : req.body.datas[i].yearstartbln 
                            }   
                           }  
                },function(err,result){  
                  if (err) return console.error(err);  
                  console.log(result);  
                  });
            }
/*    Account.update({_id: req.body.datas[i]._id}, { $push : { year:{
            startbln: req.body.datas[i].startbln}, month:{
                startbln: req.body.datas[i].startbln} }}, function(err,result){  
                 if (err) return console.error(err);
             }); 
*/
	res.redirect('/iniaccount');
});


                


module.exports = router;