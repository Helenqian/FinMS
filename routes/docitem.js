
var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/Initial');

router.get('/docitem', function (req, res, next) {
        res.render('accbook/docitem');
});

router.get('/api/docitem', function (req, res, next) {
    if(!req.query.date){
    DocumentItem.find({}).populate('account').populate('header').exec(function (err, docitem) {
        if (err) return next(err);
        //console.log("date:"+req.query.date);
        var data =[];
        var _page = req.query.page;
        var _limit = req.query.limit;
          for (var j = (_page - 1) * _limit ; j < _page * _limit && (docitem[j] != null); j++){
              var o = {};
              o.id = docitem[j].id;
              o.num = docitem[j].num;
              o.debit = docitem[j].debit;
              o.credit = docitem[j].credit;
              o.account = docitem[j].account.name;
              o.header = docitem[j].header.name;
              data.push(o);
          }
                var responsedata = {
                code: 0,
                msg: "",
                count: data.length,
                data: data
                  } 
                res.send(responsedata);
      });  
    }
    else{
        DocumentItem.find({}).populate('account').populate('header').exec(function (err, docitem) {
            if (err) return next(err);
            console.log("date:"+req.query.date);
            var data =[];
            var _page = req.query.page;
            var _limit = req.query.limit;
              for (var j = (_page - 1) * _limit ; j < _page * _limit && (docitem[j] != null); j++){
                  var o = {};
                  o.id = docitem[j].id;
                  o.num = docitem[j].num;
                  o.debit = docitem[j].debit;
                  o.credit = docitem[j].credit;
                  o.account = docitem[j].account.name;
                  o.header = docitem[j].header.name;
                  data.push(o);
              }
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: data.length,
                    data: data
                      } 
                    res.send(responsedata);
          });  
    }
});

router.get('/glacc', function (req, res, next) {
        res.render('accbook/glacc');
});

router.get('/api/glacc', function (req, res, next) {
    //monthnum = "201805";
    Account.aggregate({ $project: { _id: 1, month: 1 } }).unwind('month').exec(function (err, accbook) {  
        var data =[];
        var _page = req.query.page;
        var _limit = req.query.limit;
          for (var j = (_page - 1) * _limit ; j < _page * _limit && (accbook[j] != null); j++){
              //for(var i = 0; i < accbook[j].month.length; i++){
              //if(accbook[j].month[i].num == monthnum){
                  
              var o = {};
              o.acccode = accbook[j].code;
              o.accname = accbook[j].name;
              o.monthnum = accbook[j].month.num;
              o.debamount= accbook[j].month.debamount;
              o.credamount = accbook[j].month.credamount;
              if (parseFloat(o.debamount)>parseFloat(o.credamount)){
                  o.blndirect = "借";
                  o.endbln = (parseFloat(o.debamount)-parseFloat(o.credamount))+"";
              }
              else if (parseFloat(o.debamount)<parseFloat(o.credamount)){
                o.blndirect = "贷";
                o.endbln = (parseFloat(o.credamount)-parseFloat(o.debamount))+"";
              }
              else{
                o.blndirect = "平";
                o.endbln = "0.00";
              }
              //o.blndirect = accbook[j].month.blndirect;
              //o.endbln = accbook[j].month.endbln;
              data.push(o);
              //}
              //}
          }
          //console.log(data);
                var responsedata = {
                code: 0,
                msg: "",
                count: data.length,
                data: data
                  } 
                res.send(responsedata);
    
      });  
});


module.exports = router;