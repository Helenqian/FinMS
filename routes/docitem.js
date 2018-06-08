
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
    let option ={}; var min = ""; var max = ""; var numset = [];
    var mindate = new Date(); var maxdate = new Date();
    if(req.query.date) {
        min = req.query.date.substring(0,10);
        max = req.query.date.substring(13,23);
        mindate.setFullYear(min.substring(0,4),min.substring(5,7),min.substring(8,10));
        maxdate.setFullYear(max.substring(0,4),max.substring(5,7),max.substring(8,10));
    }
    AccountDocument.find(option)
    .populate('DocumentItem')
    .exec(function (err, accdocs){
      if (err) return next(err);
        for(var j = 0; j<accdocs.length; j++){
            if(req.query.date){
            var e = accdocs[j].docdate;
            var dt = new Date(); 
            dt.setFullYear(e.substring(0,4),e.substring(5,7),e.substring(8,10));
            if((dt>mindate || dt==mindate) && (dt<maxdate || dt==maxdate)){
                console.log("!");
                numset.push(accdocs[j].num); }
            }
            else { numset.push(accdocs[j].num); }
        }
        DocumentItem.find({ num: {  $in: numset } }).populate('header').populate('account')
        .exec(function(err, docitem){
           var data=[];
           var _page = req.query.page;
           var _limit = req.query.limit;
           for (var s = (_page - 1) * _limit ; s < _page * _limit && (docitem[s] != null); s++){
            var o = {};
            o.id = docitem[s].id;
            o.num = docitem[s].num;
            o.debit = docitem[s].debit;
            o.credit = docitem[s].credit;
            o.account = docitem[s].account.name;
            o.header = docitem[s].header.name;
            data.push(o);
            }
            var responsedata = {
                code: 0,
                msg: "",
                count: docitem.length,
                data: data
            } 
            res.send(responsedata);
        });
    });
});

router.get('/glacc', function (req, res, next) {
        res.render('accbook/glacc');
});

router.get('/api/glacc', function (req, res, next) {
    //monthnum = "201805";2018-06%20-%202018-07
    let option ={}; var mindate = 0; var maxdate = 0;
    if(req.query.date) {
        mindate = parseFloat(req.query.date.substring(0,4)+req.query.date.substring(5,7));
        maxdate = parseFloat(req.query.date.substring(10,14)+req.query.date.substring(15,17));
    }
    Account.aggregate({ $project: { _id: 1, month: 1 } }).unwind('month').exec(function (err, accbook) {  
        var data =[];
        var _page = req.query.page;
        var _limit = req.query.limit;
          for (var j = (_page - 1) * _limit ; j < _page * _limit && (accbook[j] != null); j++){
            var o = {};
              o.acccode = accbook[j].code;
              o.accname = accbook[j].name;
              o.monthnum = accbook[j].month.num;
              o.debamount= accbook[j].month.debamount;
              o.credamount = accbook[j].month.credamount;
              if (parseFloat(o.debamount)>parseFloat(o.credamount)){ //借方发生额大于贷方发生额
                  o.blndirect = "借";
                  o.endbln = (parseFloat(o.debamount)-parseFloat(o.credamount))+"";
              }
              else if (parseFloat(o.debamount)<parseFloat(o.credamount)){ //借方发生额小于贷方发生额
                o.blndirect = "贷";
                o.endbln = (parseFloat(o.credamount)-parseFloat(o.debamount))+"";
              }
              else{ //借方发生额等于贷方发生额
                o.blndirect = "平";
                o.endbln = "0.00";
              }
            if(req.query.date){
                var e = accbook[j].month.num;
                var dt = parseFloat(e);
                if((dt>mindate || dt==mindate) && (dt<maxdate || dt==maxdate)){
                    console.log("!");
                    data.push(o);
                }
            }   else {
              data.push(o);
          }
        }
                var responsedata = {
                code: 0,
                msg: "",
                count: accbook.length,
                data: data
                  } 
                res.send(responsedata);

      });  
});


module.exports = router;