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