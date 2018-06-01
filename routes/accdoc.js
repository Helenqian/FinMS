var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/Initial');

router.get('/accdoc', function (req, res, next) {
    res.render('document/accdoc');
});


router.get('/addaccdoc', function (req, res, next) {
    Initial.find({}, function (err, init) {
        if (err) return next(err);
        res.render('document/addaccdoc',
            {
                init: init
            });
        });
});
/*
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
    */

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
            if(req.query.new){
                for(var i = 0; i < req.query.new && i < _limit; i++)
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
        var docdate = req.body.docdate;
        var yearnum = docdate.substring(0,4);
        var month1 = docdate.substring(5,7);
        var monthnum = yearnum+month1;
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
            });
        });
    });
});

/*
router.post("/addcheckdocitem", function(req, res, next) {
    console.log(req.body.datas);
    codesum = [];
    for(var i = 0; i < req.body.datas.length; i++){
        codesum[i] = req.body.datas[i].headercode;
    }
    Header.find({code:{$in:[codesum]}}, function(err, existingHeader){
        var docitem = {};
        console.log("进入了"+req.body.datas[i].id+"的循环");
        console.log(req.body.datas[i].headercode);
        console.log("i="+i);
        docitem.id = req.body.datas[i].id;
        docitem.num = req.body.datas[i].num;
        docitem.debit = req.body.datas[i].debit;
        docitem.credit = req.body.datas[i].credit;
        if(existingHeader) {
            docitem.header = existingHeader;
        }
        else{
            if(err) return next(err);
            var header = new Header();
            header.code = req.body.datas[i].headercode;
            header.name = req.body.datas[i].headername;
            header.save(function(err, header){
            if(err) return next(err);
            console.log('New header has been created' + header + " id " + header._id);
            docitem.header = header._id;
            });
        }
        Account.findOne({code: req.body.datas[i].acccode, name: req.body.datas[i].accname}, function(err, existingAcc){
            if(existingAcc) {
            docitem.account = existingAcc;
            }
            else{
            if(err) return next(err);
            console.log("Account is invalid!");
            }
            DocumentItem.findOne({ id: req.body.datas[i].id }, function(err, existingDoc){
                if(existingDoc){
                console.log("Document with that id already exists");
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
                console.log('New docitem has been created!');
                });
                }
            });
        });
    });
}


Initial.find({},function(err, ini){
    if (err) return next(err);
    var w = ini[0].currnum;
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
          accdoc.postdate = '0000-00-00';
          accdoc.maker = req.body.maker;
          accdoc.debitsum = debitsum + "";
          accdoc.creditsum = creditsum + "";
          accdoc.checkstatus = 'false';
          accdoc.poststatus = 'false';
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
*/

            
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

/*
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
*/

router.post('/checkbalance', function(req, res, next){
    Initial.find({},function(err, ini){
        if (err) return next(err);
        var w = ini[0].currnum;
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
              accdoc.postdate = '0000-00-00';
              accdoc.maker = req.body.maker;
              accdoc.debitsum = debitsum + "";
              accdoc.creditsum = creditsum + "";
              accdoc.checkstatus = 'false';
              accdoc.poststatus = 'false';
              accdoc.type = req.body.type;
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
                        o.yearnum = docitem[j].yearnum;
                        o.monthnum = docitem[j].monthnum;
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
                          var conditions = {currnum: w};
                          var updates = {$set: {currnum: ((parseInt(w)+1)+"")}};
                        Initial.update(conditions, updates, function (error) {  
                            if (error) {  
                            console.error(error);  
                            } else {  
                            console.error("更新currnum成功");  
                            }  
                        });  
                console.log("accdoc equals = "+accdoc);
                res.send("Success,借贷平! "+"借: "+debitsum+" 贷: "+creditsum);
                });
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
        User.findOne({ _id: req.user._id }, function(err, user){
            if (err) return next(err);
            res.render('document/viewaccdoc',
         {
             num1: req.query.num, docdate1: accdoc.docdate, maker1: accdoc.maker
             ,cs1: accdoc.checkstatus, ps1: accdoc.poststatus, user: user
         });
        });
    });
});

router.get('/api/accdoc', function (req, res, next) {
    let option ={}; 
    var min = ""; var max = "";
    var mindate = new Date(); var maxdate = new Date();
    if(req.query.adnum) option.num = req.query.adnum;
    if(req.query.maker) option.maker = req.query.maker;
    if(req.query.date) {
        min = req.query.date.substring(0,10);
        console.log("min"+min);
        max = req.query.date.substring(13,23);
        console.log("max"+max);
        mindate.setFullYear(min.substring(0,4),min.substring(5,7),min.substring(8,10));
        maxdate.setFullYear(max.substring(0,4),max.substring(5,7),max.substring(8,10));
        console.log("mindate"+mindate);
        console.log("maxdate"+maxdate);
    }
    if((req.query.checkstatus == "false")||(req.query.checkstatus == "true")) 
        option.checkstatus = req.query.checkstatus;
    if((req.query.poststatus == "false")||(req.query.poststatus == "true")) 
        option.poststatus = req.query.poststatus;
    AccountDocument.find(option, function (err, accdocs) {
      if (err) return next(err);
      var data =[];
      var _page = req.query.page;
      var _limit = req.query.limit;
      for (var j = (_page - 1) * _limit ; j < _page * _limit && (accdocs[j] != null); j++)
         {
            if(req.query.date){
            var e = accdocs[j].docdate;
            var dt = new Date(); 
            dt.setFullYear(e.substring(0,4),e.substring(5,7),e.substring(8,10));
            console.log("dt"+dt);
            if((dt>mindate || dt==mindate) && (dt<maxdate || dt==maxdate)){
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
            }
            else{
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
            console.log(docitem[j]);
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
    //过账流程：将会计科目关联的凭证项目改变
    //根据会计科目类型，计算会计科目对应凭证下期间变化额（加入debitsum,creditsum)
    //最后将凭证过账状态 过账时间的改变
        AccountDocument.findOne({num: req.body.num},function(err,accdoc){
            if(err) return next(err);
            var docdate = accdoc.docdate;
            console.log("docdate = "+docdate);
            var yearnum = docdate.substring(0,4);
            var month1 = docdate.substring(5,7);
            var monthnum = yearnum+month1;
            accdoc.update({poststatus: 'true'} ,function(err,result){
                if (err)
                return next(err);
                if (result)
                console.log(result);
            });
            var myDate = new Date();
            accdoc.update({postdate: myDate.toLocaleDateString()} ,function(err,result){
                if (err)
                return next(err);
                if (result)
                console.log(result);
            });
            //console.log("yearnum:"+yearnum+"monthnum"+monthnum);
            DocumentItem.find({num: req.body.num},function(err,docitem){
                if(err) return next(err);
                for(var i = 0; i < docitem.length; i++){
                (function(i){
                Account.update({_id: docitem[i].account}, { $push : 
                 { DocumentItem: docitem[i]}},
                 function(err,result){
                console.log("1234 "+docitem[i]);
                if (err) return next(err);
                //if (result) console.log(result);
                });
            })(i)
            }
        
                return res.redirect('/viewaccdoc?num=' + req.body.num);
        });
    });
});

/*
router.post("/postad", function(req, res, next){
    //过账流程：将会计科目关联的凭证项目改变
    //根据会计科目类型，计算会计科目对应凭证下期间变化额（加入debitsum,creditsum)
    //最后将凭证过账状态 过账时间的改变
        AccountDocument.findOne({num: req.body.num},function(err,accdoc){
            if(err) return next(err);
            var docdate = accdoc.docdate;
            console.log("docdate = "+docdate);
            var yearnum = docdate.substring(0,4);
            var month1 = docdate.substring(5,7);
            var monthnum = yearnum+month1;
            //console.log("yearnum:"+yearnum+"monthnum"+monthnum);
            DocumentItem.find({num: req.body.num},function(err,docitem){
                if(err) return next(err);
                for(var i = 0; i < docitem.length; i++){
                
                Account.update({_id: docitem[i].account}, { $push : 
                 { DocumentItem: docitem[i]}},
                 function(err,result){
                console.log("1234 "+docitem[i]);
                if (err) return next(err);
                if (result) console.log(result);
                });
                
               //console.log("11111 i: "+i+"docitem[i]:" +docitem[i]);
                //var actn = docitem[i].account;
                //var deb = docitem[i].debit;
                //var cred = docitem[i].credit;
                //console.log("1234 "+docitem[i]);
                //console.log("56 "+deb);
                //console.log("78 "+cred);
                (function(i){
                Account.findById(docitem[i].account, function(err, acc){
                    if(err) return next(err);
                    console.log("22222 i: "+i+"docitem[i]:" +docitem[i]);
                    var y = {};
                    (function(y){
                    for(var j = 0; j < acc.year.length; j++)
                    {
                        if(acc.year[j].num == yearnum){
                            y.num = acc.year[j].num;
                            y.startbln = acc.year[j].startbln;
                            y.endbln = acc.year[j].endbln;
                            y.debamount = acc.year[j].debamount;
                            y.credamount = acc.year[j].credamount;
                            console.log("y.deba= "+y.debamount);
                            console.log("y.creda= "+y.credamount);
                        }
                    }
                    /*
                    if(acc.year.debamount == undefined) {var a = 0.00;}
                    else { var a = parseFloat(acc.year.debamount);}
                    if(acc.year.credamount == undefined) {var b = 0.00;}
                    else { var b = parseFloat(acc.year.credamount);}
                    console.log("a: " + a);
                    console.log("b: " + b);
                    
                    var c = parseFloat(docitem[i].debit);
                    var d = parseFloat(docitem[i].credit);
                    var e = a+c+"";
                    var f = b+d+"";
                    console.log("a: " + a);
                    console.log("b: " + b);
                    console.log("c: " + c);
                    console.log("d: " + d);
                    console.log("e: " + e);
                    console.log("f: " + f);*/
                    /*
                    Account.update(  
                        {   
                             "_id" : acc._id,  
                             "year.num" : yearnum  
                        },  
                        {  
                             $set: {  
                                  "year.$" : {
                                  "num" : y.num,
                                  "startbln" : y.startbln,
                                  "endbln" : y.endbln,
                                  "debamount" : (parseFloat(y.debamount)+c)+"",
                                  "credamount" : (parseFloat(y.credamount)+d)+"",
                                    }  
                        }},function(err,result){  
                          if (err) return console.error(err);  
                          //console.log(result);  
                    });
                })(y)
                });
            })(i)
            
            /*
            Account.aggregate({ $project: { _id: 1, year: 1, month: 1 } }).unwind('year').unwind('month').exec(function (err, doc) {  
                if (err) return console.error(err);  
                console.log("doc of acc= "+doc);
                /*
                for(var j = 0; j < doc.year.length; j++){
                    if(doc.year[j].num == yearnum)
                         {console.log("doc.year.num= "+doc.year[j].num);
                         Account.update(  
                            {   
                                 "_id" : doc._id,  
                                 "year.num" : yearnum  
                            },  
                            {  
                                 $set: {  
                                      "year.$" : {
                                      "debamount" : (parseFloat(doc.year[j].debamount)+docitem[i].debit)+"",
                                      "credamount" : (parseFloat(doc.year[j].credamount)+docitem[i].credit)+""
                                        }  
                            }},function(err,result){  
                              if (err) return console.error(err);  
                              console.log(result);  
                        });
                        }
                    }
                    */
                /*});
            }
           /*
           Account.findOne({"_id" : docitem[i].account,},function(error, doc) {
                for(var j = 0; j < doc.year.length; j++){
                    if(doc.year[j].num == yearnum) 
                    {console.log("doc.year.num= "+doc.year[j].num);
            Account.update(  
                {   
                     "_id" : doc._id,  
                     "year.num" : yearnum  
                },  
                {  
                     $set: {  
                          "year.$" : {
                          "debamount" : (parseFloat(doc.year[j].debamount)+docitem[i].debit)+"",
                          "credamount" : (parseFloat(doc.year[j].credamount)+docitem[i].credit)+""
                            }  
                }},function(err,result){  
                  if (err) return console.error(err);  
                  console.log(result);  
            });
            }
        }
        for(var j = 0; j < doc.year.length; j++){
            if(doc.month[j].num == monthnum)
            {console.log("doc.month.num= "+doc.month[j].num);
            Account.update(  
                    {   
                         "_id" : doc._id,  
                         "month.num" : monthnum  
                    },  
                    {  
                         $set: {  
                              "month.$" : { 
                              "num" : monthnum, 
                              "debamount" : (parseFloat(doc.month[j].debamount)+docitem[i].debit)+"",
                              "credamount" : (parseFloat(doc.month[j].credamount)+docitem[i].credit)+""
                                }  
                    }},function(err,result){  
                      if (err) return console.error(err);  
                      console.log(result);  
            });
             }

            }
        });
        }

        
    });
    
});
});
*/

module.exports = router;