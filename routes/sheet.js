var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/Initial');
var BlnSheet = require('../models/BlnSheet');
var PlSheet = require('../models/PlSheet');

router.get('/balancesheet', function(req, res, next){
    res.render('sheet/balance');
});

router.get('/api/blsheet', function(req, res, next){
    BlnSheet.find({period: "template"},
        function (err, blnitems) {
            if (err) return next(err);
            var data =[];
            var _page = req.query.page;
            var _limit = req.query.limit;
            for (var j = (_page - 1) * _limit ; j < _page * _limit && (blnitems[j] != null); j++)
            {
                var o = {};
                o.assproj  = blnitems[j].assproj;
                o.assnum  = blnitems[j].assnum;
                o.assendbln  = blnitems[j].assendbln;
                o.assstartbln  = blnitems[j].assstartbln;
                o.liabproj  = blnitems[j].liabproj;
                o.liabnum  = blnitems[j].liabnum;
                o.liabendbln  = blnitems[j].liabendbln;
                o.liabstartbln  = blnitems[j].liabstartbln;
                data.push(o);
            }
            console.log(data);
            var responsedata = {
            code: 0,
            msg: "",
            count: blnitems.length,
            data: data
              } 
            res.send(responsedata);
        });
});

router.get('/generatebl', function(req, res, next){
    var curryear = "2018", currmonth = "201805";
    BlnSheet.find({period: "template"}, function (err, blnitems) {
    Account.aggregate({$project: { _id: 1, month: 1, year: 1 } })
    .unwind('month').unwind('year').exec(function (err, acc){
    //Account.find({})
    //.unwind('month').unwind('year').exec(function (err, acc){
    //console.log(acc);
    var visit = [];
    for(var i=0; i<acc.length; i++){
        visit[i]=false;
    }
    var blndata = [];
    for(var j=0; j<blnitems.length; j++){
        var o = {};
        var cash = {}, short = {}, other = {}, stock = {}, intangible ={};
        cash.startbln = "0.00"; cash.endbln = "0.00";
        stock.startbln = "0.00"; stock.endbln = "0.00";
        other.startbln = "0.00"; other.endbln = "0.00";
        intangible.startbln = "0.00"; intangible.endbln = "0.00";
        short.startbln = "0.00"; short.endbln = "0.00";

        o.assproj  = blnitems[j].assproj;
        o.assnum  = blnitems[j].assnum;
        o.assendbln  = blnitems[j].assendbln;
        o.assstartbln  = blnitems[j].assstartbln;
        o.liabproj  = blnitems[j].liabproj;
        o.liabnum  = blnitems[j].liabnum;
        o.liabendbln  = blnitems[j].liabendbln;
        o.liabstartbln  = blnitems[j].liabstartbln;

        for(var i=0; i<acc.length; i++){
            //货币资金
            if(acc[i].num == '1001' || acc[i].num == '1002'
                || acc[i].num == '1003' ){
                    for(var s=0; s<acc[i].year.length; s++){
                        if(acc[i].year[s].num == curryear){
                            cash.startbln = (parseFloat(cash.startbln)+
                            parseFloat(acc[i].year[s].startbln))+"";
                    }
                   }
                   for(var s=0; s<acc[i].month.length; s++){
                    if(acc[i].month[s].num == currmonth){
                        cash.endbln = (parseFloat(cash.endbln)+
                        parseFloat(acc[i].month[s].endbln))+"";
                    }
                   }
                continue;
            }
            //短期投资
            if(acc[i].num == '1101' || acc[i].num == '1102' ){
                    for(var s=0; s<acc[i].year.length; s++){
                        if(acc[i].year[s].num == curryear){
                            short.startbln = (parseFloat(short.startbln)+
                            parseFloat(acc[i].year[s].startbln))+"";
                    }
                   }
                   for(var s=0; s<acc[i].month.length; s++){
                    if(acc[i].month[s].num == currmonth){
                        short.endbln = (parseFloat(short.endbln)+
                        parseFloat(acc[i].month[s].endbln))+"";
                    }
                   }
                continue;
            }
            //存货
            /*
            if(acc[i].num.indexOf("12") == 0 ){
                for(var s=0; s<acc[i].year.length; s++){
                    if(acc[i].year[s].num == curryear){
                        stock.startbln = (parseFloat(stock.startbln)+
                        parseFloat(acc[i].year[s].startbln))+"";
                }
               }
               for(var s=0; s<acc[i].month.length; s++){
                if(acc[i].month[s].num == currmonth){
                    stock.endbln = (parseFloat(stock.endbln)+
                    parseFloat(acc[i].month[s].endbln))+"";
                }
               }
            continue;
            }
            */
            //无形资产intangible
            if(acc[i].num == '1801' || acc[i].num == '1805' ){
                for(var s=0; s<acc[i].year.length; s++){
                    if(acc[i].year[s].num == curryear){
                        intangible.startbln = (parseFloat(intangible.startbln)+
                        parseFloat(acc[i].year[s].startbln))+"";
                }
               }
               for(var s=0; s<acc[i].month.length; s++){
                if(acc[i].month[s].num == currmonth){
                    intangible.endbln = (parseFloat(intangible.endbln)+
                    parseFloat(acc[i].month[s].endbln))+"";
                }
               }
            continue;
            }
            //其他长期资产
            if(acc[i].num == '1815' || acc[i].num == '1911' ){
                for(var s=0; s<acc[i].year.length; s++){
                    if(acc[i].year[s].num == curryear){
                        other.startbln = (parseFloat(other.startbln)+
                        parseFloat(acc[i].year[s].startbln))+"";
                }
               }
               for(var s=0; s<acc[i].month.length; s++){
                if(acc[i].month[s].num == currmonth){
                    other.endbln = (parseFloat(other.endbln)+
                    parseFloat(acc[i].month[s].endbln))+"";
                }
               }
            continue;
            }
            if(acc[i].name == o.assproj) {
               //找到了对应的资产
               for(var s=0; s<acc[i].year.length; s++){
                    if(acc[i].year[s].num == curryear){
                        o.assstartbln = acc[i].year[s].startbln;
                    }
               }
               for(var s=0; s<acc[i].month.length; s++){
                if(acc[i].month[s].num == currmonth){
                    o.assendbln = acc[i].month[s].endbln;
                }
               }
           }
           else if(acc[i].name == o.liabproj){
               //找到了对应的负债
               for(var s=0; s<acc[i].year.length; s++){
                if(acc[i].year[s].num == curryear){
                    o.liabstartbln = acc[i].year[s].startbln;
                }
              }
              for(var s=0; s<acc[i].month.length; s++){
                if(acc[i].month[s].num == currmonth){
                o.liabendbln = acc[i].month[s].endbln;
              }
             }
           }
        }
        if(o.assproj == "货币资金") {o.assstartbln = cash.startbln; o.assendbln = cash.endbln;}
        else if (o.assproj == "短期投资") {o.assstartbln = short.startbln; o.assendbln = short.endbln;}
        else if (o.assproj == "存货") {o.assstartbln = stock.startbln; o.assendbln = stock.endbln;}
        else if (o.assproj == "无形资产") {o.assstartbln = intangible.startbln; o.assendbln = intangible.endbln;}
        else if (o.assproj == "其他长期资产") {o.assstartbln = other.startbln; o.assendbln = other.endbln;}
        blndata.push(o);
    }
    console.log(blndata);
    /*
        var di = new DocumentItem({
            id : docitem.id,
            num : docitem.num,
            debit : docitem.debit,
            credit : docitem.credit,
            header : docitem.header,
            account : docitem.account,
            yearnum : yearnum,
            monthnum : monthnum
            });
            di.save(function(err){
            if(err) return next(err);
            console.log('New docitem has been created   ');
            //return res.redirect('/addaccdoc');
            });
            }
            */
    });
    });
});

router.get('/addblnsheet', function(req, res, next) {
    res.render('sheet/addblnsheet');
});

router.post('/addblnsheet', function(req, res, next) {
    
                var blnsheet = new BlnSheet();
        
                blnsheet.period = 'template';
                blnsheet.assproj = req.body.assproj;
                blnsheet.assnum = req.body.assnum;
                blnsheet.assstartbln = '';
                blnsheet.assendbln = '';
                blnsheet.liabproj = req.body.liabproj;
                blnsheet.liabnum = req.body.liabnum;
                blnsheet.liabstartbln = '';
                blnsheet.liabendbln = '';

                blnsheet.save(function(err, blnsheet){
                   if(err) return next(err);
                     console.log("new template has been created"+req.body.assproj+req.body.liabproj);
                     return res.redirect('/addblnsheet');
                    });
      });

router.get('/plsheet', function(req, res, next){
    res.render('sheet/profitloss');
});

router.get('/api/plsheet', function(req, res, next){
    PlSheet.find({period: "template"},
        function (err, plitems) {
            if (err) return next(err);
            var data =[];
            var _page = req.query.page;
            var _limit = req.query.limit;
            for (var j = (_page - 1) * _limit ; j < _page * _limit && (plitems[j] != null); j++)
            {
                var o = {};
                o.plproj  = plitems[j].plproj;
                o.plnum  = plitems[j].plnum;
                o.plmonthamt = plitems[j].plmonthamt;
                o.plyearamt = plitems[j].plyearamt;
               
                data.push(o);
            }
            console.log(data);
            var responsedata = {
            code: 0,
            msg: "",
            count: plitems.length,
            data: data
              } 
            res.send(responsedata);
        });
});

router.get('/addplsheet', function(req, res, next) {
    res.render('sheet/addplsheet');
});

router.post('/addplsheet', function(req, res, next) {
    
                var plsheet = new PlSheet();
        
                plsheet.period = 'template';
                plsheet.plproj = req.body.plproj;
                plsheet.plnum = req.body.plnum;
                plsheet.plmonthamt = '';
                plsheet.plyearamt = '';
               

                plsheet.save(function(err, plsheet){
                   if(err) return next(err);
                     console.log("new template has been created"+req.body.plproj+"  "+req.body.plbproj);
                     return res.redirect('/addplsheet');
                    });
      });

module.exports = router;