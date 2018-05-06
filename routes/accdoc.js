var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');

router.get('/accdoc', function (req, res, next) {
    res.render('document/accdoc');
});


router.get('/addaccdoc', function (req, res, next) {
    AccountDocument.find({}, 'num base', function (err, accdoc) {
        if (err) return next(err);
        res.render('document/addaccdoc',
            {
                accdoc: accdoc
            });
        });
});


router.post('/addaccdoc', function(req, res, next) {
    
                var accdoc = new Account();
        
                accdoc.num = req.body.accdocnum;
                accdoc.name = req.body.accdocname;
    
                Account.findOne({ num: req.body.accdocnum }, function(err, existingAccount){
    
                    if(existingAccount){
                        //console.log(req.body.email + " is already exist");
                        req.flash('message', 'Account with that num already exists');
                        return res.redirect('/addaccdoc');
                  } else {
                    accdoc.save(function(err, accdoc){
                     if(err) return next(err);
                     req.flash('message', 'New accdoc has been created');
                     return res.redirect('/addaccdoc');
                    });
                }
            });
        });

router.get('/api/accdoc', function (req, res, next) {

        AccountDocument.find({}, function (err, accdocs) {
          if (err) return next(err);
          var data =[];
          var _page = req.query.page;
                    var _limit = req.query.limit;
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accdocs[j] != null); j++)
                    {
                        var o = {};
                        o.num  = accdocs[j].num;
                        o.docdate = accdocs[j].docdate;
                        o.postdate = accdocs[j].postdate;
                        o.maker = accdocs[j].maker;
                        o.debitsum = accdocs[j].debitsum;
                        o.creditsum = accdocs[j].creditsum;
                        o.checkstatus = accdocs[j].checkstatus;
                        o.poststatus = accdocs[j].poststatus;
                        data.push(o);
                    }
                    console.log(data);
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accdocs.length,
                    data: data
                      } 
                    res.send(responsedata);
                });
       });

router.get('/api/addaccdoc', function (req, res, next) {
    AccountDocument.find({},function(err, AD){
        if (err) return next(err);
        var w =0;
        if (!AD) w = 1001;
        else {w = 1000 + AD.length + 1;}
        DocumentItem.find({ num: w }).populate('account').populate('header').exec(function (err, docitem) {
          if (err) return next(err);
          var data =[];
          var _page = req.query.page;
          var _limit = req.query.limit;
          console.log('docitem is' + docitem[0]);
            for (var j = (_page - 1) * _limit ; j < _page * _limit && (docitem[j] != null); j++){
                var o = {};
                o.id = docitem[j].id;
                o.num = docitem[j].num;
                o.debit = docitem[j].debit;
                o.credit = docitem[j].credit;
                o.acccode = docitem[j].account.code;
                o.accname = docitem[j].account.name;
                o.headercode = docitem[j].header.code;
                o.headername = docitem[j].header.name;
                console.log("o + "+o);
                data.push(o);
            }
            if(req.query.new == 1){
                var o = {};
                    o.id= "";
                    o.num  = "";
                    o.headercode = ""
                    o.headername = "";
                    o.acccode = "";
                    o.accname = "";
                    o.debit = "";
                    o.credit = "";
                    data.push(o);
                }
                console.log("data: "+data);
                var responsedata = {
                code: 0,
                msg: "",
                count: data.length,
                data: data
                  } 
                res.send(responsedata);
            });  
           });
        /*
        DocumentItem.find({num: w}, function (err, docitem) {
          if (err) return next(err);
          var data =[];
          var _page = req.query.page;
          var _limit = req.query.limit;
          for (var j = (_page - 1) * _limit ; j < _page * _limit && (docitem[j] != null); j++){
            console.log(docitem[j]);
            var o = {};
            o.id = docitem[j].id;
            o.num = docitem[j].num;
            o.debit = docitem[j].debit;
            o.credit = docitem[j].credit;


                Account.findOne({_id: docitem[j].account}, function(err, acc){
                    if(err) return (err);
                    if(acc){
                        console.log("acc : "+acc);
                    o.acccode = acc.code;
                    o.accname = acc.name;
                    }
                    });
                Header.findOne({_id: docitem[j].header}, function(err, dij){
                    if(err) return next(err);
                    if(dij){
                        console.log("dij : "+dij);
                        o.headercode = dij.code;
                        o.headername = dij.name;
                }
            });
            data.push(o);
       }
                    if(req.query.new == 1){
                    var o = {};
                        o.id= "";
                        o.num  = "";
                        o.headercode = ""
                        o.headername = "";
                        o.acccode = "";
                        o.accname = "";
                        o.debit = "";
                        o.credit = "";
                        data.push(o);
                    }
                    console.log(data);
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: docitem.length + 1,
                    data: data
                      } 
                    res.send(responsedata);  
    }); */
});
    
/*
router.get('/api/addaccdoc', function (req, res, next) {

        DocumentItem.find({num: req.body.num}, function (err, accdocs) {
          if (err) return next(err);
          var data =[];
          var _page = req.query.page;
                    var _limit = req.query.limit;
                    console.log("1");
                    for (var j = (_page - 1) * _limit ; j < _page * _limit && (accdocs[j] != null); j++)
                    {
                        var o = {};
                        o.num  = accdocs[j].num;
                        o.headercode = accdocs[j].headercode;
                        o.headername = accdocs[j].headername;
                        o.acccode = accdocs[j].acccode;
                        o.accname = accdocs[j].accname;
                        o.debit = accdocs[j].debit;
                        o.credit = accdocs[j].credit;
                        data.push(o);
                    }
                    if(req.query.new == 1){
                    var o = {};
                        o.num  = "";
                        o.headercode = ""
                        o.headername = "";
                        o.acccode = "";
                        o.accname = "";
                        o.debit = "";
                        o.credit = "";
                        data.push(o);
                    }
                    console.log(data);
                    var responsedata = {
                    code: 0,
                    msg: "",
                    count: accdocs.length + 1,
                    data: data
                      } 
                    res.send(responsedata);
                });
       });
    */

router.post("/savedocitem", function(req, res, next) {
    
             // var di = new DocumentItem();
              Header.findOne({code: req.body.headercode}, function(err, existingHeader){
                var docitem = {};
                docitem.id = req.body.id;
                docitem.num = req.body.num;
                docitem.debit = req.body.debit;
                docitem.credit = req.body.credit;
                  if(existingHeader) {
                      docitem.header = existingHeader;
                  }
                  else{
                      if(err) return next(err);
                      var header = new Header();
                      header.code = req.body.headercode;
                      header.name = req.body.headername;
                      header.save(function(err, header){
                            if(err) return next(err);
                             console.log('New header has been created' + header + " id " + header._id);
                             docitem.header = header._id;
                             //console.log("dh"+ docitem.header);
                        });
                  }
                  Account.findOne({code: req.body.acccode, name: req.body.accname}, function(err, existingAcc){
                    if(existingAcc) {
                        docitem.account = existingAcc;
                        //console.log("da"+ docitem.account);
                    }
                    else{
                        if(err) return next(err);
                        console.log("Account is invalid!");
                    }
                    DocumentItem.findOne({ id: req.body.id }, function(err, existingDoc){
    
                                        if(existingDoc){
                                            console.log("Account with that num already exists");
                                            //req.flash('message', 'Account with that num already exists');
                                            return res.redirect('/addaccdoc');
                                        } else {
                                            var di = new DocumentItem({
                                                id : docitem.id,
                                                num : docitem.num,
                                                debit : docitem.debit,
                                                credit : docitem.credit,
                                                header : docitem.header,
                                                account : docitem.account
                                            });
                                           di.save(function(err){
                                           if(err) return next(err);
                                           console.log('New docitem has been created   ');
                                           //console.log(docitem + "is docitem");
                                           return res.redirect('/addaccdoc');
                                         });
                                    }
                                });
                            });
                  });
                });
                
              

              //docitem.header.code = req.body.headercode;
              //docitem.header.name = req.body.headername;
              //docitem.account.code = req.body.acccode;
              //docitem.account.name = req.body.accname;
             
    
                



    module.exports = router;


