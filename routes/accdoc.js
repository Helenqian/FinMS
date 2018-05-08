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
                data.push(o);
            }
            if(req.query.new == 1){
                for(var i = 0; i < 5; i++)
                {
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
                }
                var responsedata = {
                code: 0,
                msg: "",
                count: data.length,
                data: data
                  } 
                res.send(responsedata);
        });  
    });
});
    


router.post("/adddocitem", function(req, res, next) {
    
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
            });
        }
        Account.findOne({code: req.body.acccode, name: req.body.accname}, function(err, existingAcc){
            if(existingAcc) {
            docitem.account = existingAcc;
            }
            else{
            if(err) return next(err);
            console.log("Account is invalid!");
            }
            DocumentItem.findOne({ id: req.body.id }, function(err, existingDoc){
                if(existingDoc){
                console.log("Document with that id already exists");
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
                return res.redirect('/addaccdoc');
                });
                }
            });
        });
    });
});


            

router.post('/deletedocitem', function(req, res, next){
    console.log("id + " + req.body.id + " num : "+ req.body.num);
	DocumentItem.findOne({id: req.body.id, num: req.body.num}, function(err, toDeleteDocitem){
		if(!toDeleteDocitem){
			console.log('delete failed', 'Docitem does not exist');
			return res.redirect('/addaccdoc');
		} else {
			DocumentItem.remove({ _id: toDeleteDocitem._id }, function(err){
				if(err) return next(err);
				console.log("docitem already delete");
				return res.redirect('/addaccdoc');
			});
		}
	});
});

router.post('/checkbalance', function(req, res, next){
    AccountDocument.find({},function(err, AD){
        if (err) return next(err);
        var w =0;
        if (!AD) w = 1001;
        else {w = 1000 + AD.length + 1;}
        console.log("w = "+w);
        DocumentItem.find({ num: w }, function (err, docitem) {
          if (err) return next(err);
          if(!docitem) {console.log("该凭证"+w+"无条目！");}
          else{ 
          var debitsum = 0; var creditsum = 0;
          for(var i = 0; i < docitem.length && docitem[i]; i++)
          {
                debitsum = debitsum + 1*(docitem[i].debit);
                creditsum = creditsum + 1*(docitem[i].credit);
          }
          if (debitsum == creditsum) { 
              var accdoc = new AccountDocument();
              accdoc.num = w;
              accdoc.docdate = req.body.docdate;
              accdoc.postdate = '0/0/0000';
              accdoc.maker = req.body.maker;
              accdoc.debitsum = debitsum + "";
              accdoc.creditsum = creditsum + "";
              accdoc.checkstatus = 'false';
              accdoc.poststatus = 'false';
              accdoc.base = 1000;
              accdoc.save(function(err, accdoc){
                  if(err) return next(err);
                    console.log('New accdoc has been created');
                    var docitems = [];
                    for(var j = 0; j < docitem.length; j++)
                   {
                       var o={};
                        o.debit = docitem[j].debit;
                        o.credit = docitem[j].credit;
                        o.header = docitem[j].header;
                        o.account = docitem[j].account;
                        docitems.push(o);
                    }
                AccountDocument.update({num: w}, { $pushAll : 
                  { DocumentItem: docitems
                      }},{ safe:true, multi:true},
                      function(err,result){
                          if (err)
                          return next(err);
                          if (result)
                          console.log(result);
                        });
                console.log("accdoc equals = "+accdoc);
                res.send("Success,借贷平! "+"借: "+debitsum+" 贷: "+creditsum);
            });  
        }            
            else { res.send("Failure,借贷不平! "+"借: "+debitsum+" 贷: "+creditsum);}
        }
        });
    });
});

router.get('/viewaccdoc',function(req,res,next){
    AccountDocument.findOne({num: req.query.num},'docdate maker checkstatus poststatus', function (err, accdoc) {
        if(err) return next(err);
        res.render('document/viewaccdoc',
         {
             num1: req.query.num, docdate1: accdoc.docdate, maker1: accdoc.maker
             ,cs1: accdoc.checkstatus, ps1: accdoc.poststatus
        });
    });
});

router.get('/api/accdoc', function (req, res, next) {

    AccountDocument.find({num: req.query.num}, function (err, accdocs) {
      if (err) return next(err);
      var data =[];
      var _page = req.query.page;
      var _limit = req.query.limit;
      for (var j = (_page - 1) * _limit ; j < _page * _limit && (accdocs[j] != null); j++)
         {
             var o = {};
                o.id = docitem[j].id;
                o.num = docitem[j].num;
                o.debit = docitem[j].debit;
                o.credit = docitem[j].credit;
                o.acccode = docitem[j].account.code;
                o.accname = docitem[j].account.name;
                o.headercode = docitem[j].header.code;
                o.headername = docitem[j].header.name;
                data.push(o);
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


router.get('/api/viewaccdoc', function(req, res, next){
    DocumentItem.find({num: req.query.num}).populate('account').populate('header').exec(function (err, docitem) {
        if (err) return next(err);
         var data =[];
         var _page = req.query.page;
         var _limit = req.query.limit;
      for (var j = (_page - 1) * _limit ; j < _page * _limit && (docitem[j] != null); j++){
             var o = {};
             o.num = docitem[j].num;
             o.debit = docitem[j].debit;
             o.credit = docitem[j].credit;
             o.headercode = docitem[j].header.code;
             o.headername = docitem[j].header.name;
             o.acccode = docitem[j].account.code;
             o.accname = docitem[j].account.name;
             data.push(o);
        }
         var responsedata = {
             code: 0,
             msg: "",
             count: data.length,
             data: data
        } 
        //console.log(data);
        res.send(responsedata);
    });
});

router.post("/checkad", function(req, res, next){
    AccountDocument.findOne({num: req.body.num},function(err,accdoc){
        if(err) return next(err);
        console.log(accdoc);
        if(accdoc){
        accdoc.update({checkstatus: 'true'} ,function(err,result){
            if (err)
            return next(err);
            if (result)
            console.log(result);
        });
        }
    });
});


router.post("/postad", function(req, res, next){
    //过账流程：将凭证项目关联会计科目，
    //根据会计科目类型，计算会计科目下对应年,月末的余额，期间变化额，结转下期
    //最后将凭证过账状态 过账时间的改变
    AccountDocument.find({num: req.body.num},function(err,accdoc){
        if(err) return next(err);
        var docdate = accdoc.docdate;
        var year = docdate.substr(0,4);
        var month = docdate.substr(5,2);
    DocumentItem.find({num: req.body.num},function(err,docitem){
        if(err) return next(err);
        if(docitem){
        for(var i = 0; i < docitem.length; i++){
        Account.update({_id: docitem[i].account}, { $pushAll : 
        { DocumentItem: docitem[i],}},{ safe:true, multi:true},
            function(err,result){
                if (err)
                return next(err);
                if (result)
                console.log(result);
              });
        }
        AccountDocument.find({num: req.body.num},function(err,accdoc){
            if(err) return next(err);
            var docdate = accdoc.docdate;
            var year = docdate.substr(0,4);
            var month = docdate.substr(5,2);
            var y = [];
            var o ={};
            o.yearnum = year;
            /*o.yearstart ,
            yearend: {type: String, default: '0.00'},
            yearamount: {type: String, default: '0.00'},*/
            
            Account.update({_id: docitem.account}, {year:year},{ safe:true, multi:true},
                    function(err,result){
                        if (err)
                        return next(err);
                        if (result)
                        console.log(result);
                      });
                    });
                }
            });
        });
    /*
    AccountDocument.findOne({num: req.body.num},function(err,accdoc){
        if(err) return next(err);
        console.log(accdoc);
        if(accdoc){
        accdoc.update({poststatus: 'true'} ,function(err,result){
            if (err)
            return next(err);
            if (result)
            console.log(result);
        });
        }
    });
    */
});


module.exports = router;


