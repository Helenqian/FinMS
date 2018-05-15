var router = require('express').Router();
var User = require('../models/user');
var Header = require('../models/Header');
var Account = require('../models/Account');
var AccountDocument = require('../models/AccountDocument');
var DocumentItem = require('../models/DocumentItem');
var Initial = require('../models/Initial');

router.get('/settleacc', function(req, res){
	res.render('settle/settleacc');
});

router.post('/settlepl',function(req, res,next){
    var yearnum = req.body.settleyear, month = req.body.settlemonth;
    var monthnum = yearnum + month;
    Account.find({'DocumentItem.1': {$exists: true}, 'type' : '损益类'})
    .populate('DocumentItem').exec(function (err, acc){
        if (err) return next(err);
        var profitdeb = "0.00",  mprofitdeb = "0.00";
        var profitcred = "0.00",  mprofitcred = "0.00";
        
        for(var i = 0; i < acc.length; i++){
        var debamt = "0.00", credamt = "0.00";
        var mdebamt = "0.00", mcredamt = "0.00";
        var sbln = "0.00", ebln1 = "0.00", ebln = "0.00";
        var msbln = "0.00", mebln1 = "0.00", mebln = "0.00";
        for(var x = 0; x < acc[i].year.length; x++)
        {
            if(acc[i].year[x].num == yearnum) 
            {
                sbln = acc[i].year[x].startbln;
                ebln1 = acc[i].year[x].endbln;
                break;
            }
        }
        for(var y = 0; y < acc[i].month.length; y++)
        {
            if(acc[i].month[y].num == monthnum) 
            {
                msbln = acc[i].month[y].startbln;
                mebln1 = acc[i].month[y].endbln;
                console.log("msbln111= "+ msbln);
                console.log("mebln111= "+ mebln1);
                break;
            }
        }
        //var sbln = acc[i].year[0].startbln;
        //var ebln1 = acc[i].year[0].endbln;
        var type = acc[i].type;
        ebln = ebln1;
        mbln = mebln1;
        
        for(var s =0; s < acc[i].DocumentItem.length; s++)
        {
            if(acc[i].DocumentItem[s].yearnum == yearnum){
            debamt = (parseFloat(debamt) + parseFloat(acc[i].DocumentItem[s].debit))+"";
            credamt = (parseFloat(credamt) + parseFloat(acc[i].DocumentItem[s].credit))+"";
            }
        }

        for(var j =0; j < acc[i].DocumentItem.length; j++)
        {
            if(acc[i].DocumentItem[j].monthnum == monthnum){
            mdebamt = (parseFloat(mdebamt) + parseFloat(acc[i].DocumentItem[j].debit))+"";
            mcredamt = (parseFloat(mcredamt) + parseFloat(acc[i].DocumentItem[j].credit))+"";
            }
        }
        

        var type = acc[i].type;
            
        if(type == '损益类'){
            //贷方余额
            //益：期末余额=期初余额+本期贷方发生额-本期借方发生额。
            if(((acc[i].name.indexOf("收入") != -1)||(acc[i].name.indexOf("益") != -1))
                &&(acc[i].name != "以前年度损益调整")){
                ebln = (parseFloat(sbln) + parseFloat(credamt) - parseFloat(debamt))+"";
                mebln = (parseFloat(msbln) + parseFloat(mcredamt) - parseFloat(mdebamt))+"";
                profitcred = (parseFloat(profitcred)+parseFloat(ebln))+"";
                mprofitcred = (parseFloat(mprofitcred)+parseFloat(mebln))+"";
            }
            //借方余额
            //损：期末余额=期初余额+本期借方发生额-本期贷方发生额。
            else{
                ebln = (parseFloat(sbln) + parseFloat(debamt) - parseFloat(credamt))+"";
                mebln = (parseFloat(msbln) + parseFloat(mdebamt) - parseFloat(mcredamt))+"";
                profitdeb = (parseFloat(profitdeb)+parseFloat(ebln))+"";
                profitdeb = (parseFloat(mprofitdeb)+parseFloat(mebln))+"";
            }
        }

        Account.update(  
            {   
                 "_id" : acc[i]._id,  
                 "year.num" : yearnum
            },  
            {  
                 $set: {  
                      "year.$" : {
                      "num" : yearnum,
                      "startbln" : sbln,
                      "endbln" : "0.00",
                      "debamount" : debamt,
                      "credamount" : credamt,
                        }  
            }},function(err,result){  
              if (err) return console.error(err);  
              //console.log(result);  
        });

        Account.update(  
            {   
                 "_id" : acc[i]._id,  
                 "month.num" : monthnum
            },  
            {  
                 $set: {  
                      "month.$" : {
                      "num" : monthnum,
                      "startbln" : msbln,
                      "endbln" : "0.00",
                      "debamount" : mdebamt,
                      "credamount" : mcredamt,
                        }  
            }},function(err,result){  
              if (err) return console.error(err);  
             // console.log(result);
        });

        }

    });
});

// 入账
router.post('/settleacc', function(req, res,next){
    var yearnum = req.body.settleyear, month = req.body.settlemonth;
    var monthnum = yearnum + month;
    Account.find({'DocumentItem.1': {$exists: true}})
    .populate('DocumentItem')
        //.aggregate({'DocumentItem.1': {$exists: true}},{ $project: { _id: 1, year: 1, month: 1 } })
    //.unwind('year').unwind('month')
    .exec(function (err, acc){  
        if (err) return next(err);
        //console.log(acc);
        //console.log(acc[0].DocumentItem);
        for(var i = 0; i < acc.length; i++)
        {
            var debamt = "0.00", credamt = "0.00";
            var mdebamt = "0.00", mcredamt = "0.00";
            var sbln = "0.00", ebln1 = "0.00", ebln = "0.00";
            var msbln = "0.00", mebln1 = "0.00", mebln = "0.00";
            for(var x = 0; x < acc[i].year.length; x++)
            {
                if(acc[i].year[x].num == yearnum) 
                {
                    sbln = acc[i].year[x].startbln;
                    ebln1 = acc[i].year[x].endbln;
                    break;
                }
            }
            for(var y = 0; y < acc[i].month.length; y++)
            {
                if(acc[i].month[y].num == monthnum) 
                {
                    msbln = acc[i].month[y].startbln;
                    mebln1 = acc[i].month[y].endbln;
                    console.log("msbln111= "+ msbln);
                    console.log("mebln111= "+ mebln1);
                    break;
                }
            }
            //var sbln = acc[i].year[0].startbln;
            //var ebln1 = acc[i].year[0].endbln;
            var type = acc[i].type;
            ebln = ebln1;
            mbln = mebln1;
            
            for(var s =0; s < acc[i].DocumentItem.length; s++)
            {
                if(acc[i].DocumentItem[s].yearnum == yearnum){
                debamt = (parseFloat(debamt) + parseFloat(acc[i].DocumentItem[s].debit))+"";
                credamt = (parseFloat(credamt) + parseFloat(acc[i].DocumentItem[s].credit))+"";
                }
            }

            for(var j =0; j < acc[i].DocumentItem.length; j++)
            {
                if(acc[i].DocumentItem[j].monthnum == monthnum){
                mdebamt = (parseFloat(mdebamt) + parseFloat(acc[i].DocumentItem[j].debit))+"";
                mcredamt = (parseFloat(mcredamt) + parseFloat(acc[i].DocumentItem[j].credit))+"";
                }
            }
            if(type == '资产类') {
                console.log("资!");
                //资产类: 期末余额=期初余额+本期借方发生额-本期贷方发生额；
                ebln = (parseFloat(sbln) + parseFloat(debamt) - parseFloat(credamt))+"";
                mebln = (parseFloat(msbln) + parseFloat(mdebamt) - parseFloat(mcredamt))+"";
            }
            else if((type == '负债类')||(type == '所有者权益类')) {
                console.log("负!");
                //负债类: 期末余额=期初余额+本期贷方发生额-本期借方发生额。
                ebln = (parseFloat(sbln) + parseFloat(credamt) - parseFloat(debamt))+"";
                mebln = (parseFloat(msbln) + parseFloat(mcredamt) - parseFloat(mdebamt))+"";
            }
            /*else if(type == '损益类'){
                if((acc[i].name.indexOf("收入") != -1)||(acc[i].name.indexOf("益") != -1))

            }*/
            console.log("i== " +i);
            console.log("mdebamt= "+ mdebamt);
            console.log("mcredamt= "+ mcredamt);
            console.log("msbln= "+ msbln);
            console.log("mebln= "+ mebln);

            Account.update(  
                {   
                     "_id" : acc[i]._id,  
                     "year.num" : yearnum
                },  
                {  
                     $set: {  
                          "year.$" : {
                          "num" : yearnum,
                          "startbln" : sbln,
                          "endbln" : ebln,
                          "debamount" : debamt,
                          "credamount" : credamt,
                            }  
                }},function(err,result){  
                  if (err) return console.error(err);  
                  //console.log(result);  
            });
            
            Account.update(  
                {   
                     "_id" : acc[i]._id,  
                     "month.num" : monthnum
                },  
                {  
                     $set: {  
                          "month.$" : {
                          "num" : monthnum,
                          "startbln" : msbln,
                          "endbln" : mebln,
                          "debamount" : mdebamt,
                          "credamount" : mcredamt,
                            }  
                }},function(err,result){  
                  if (err) return console.error(err);  
                 // console.log(result);
            });
            var nextmonth = "0", nextmonthnum = "0";
            if(parseInt(month) < 9) {
                nextmonth = "0"+(parseInt(month) + 1);
                nextmonthnum = yearnum + nextmonth;
            }
            else if(parseInt(month) < 12){
                nextmonth = (parseInt(month) + 1)+"";
                nextmonthnum = yearnum + nextmonth;
            }
            var nextm = {};
            nextm.num = nextmonthnum;
            nextm.startbln = mebln;
            nextm.endbln = "0.00";
            nextm.debamount = "0.00";
            nextm.credamount = "0.00";
            console.log("nextm: "+nextm);
            /*Account.find({"month.num": nextmonthnum}, function(err, existingmonth){
                if(err) return next(err);
                console.log("exm! "+existingmonth);*/
            
            Account.update({ "_id" : acc[i]._id}, 
            { $pull : { month: {num : nextmonthnum }}},function(err,result){  
                if (err) return console.error(err);  
                console.log("pull!!!!"); 
            });
            

            Account.update({_id: acc[i]._id}, { $push : 
                { month: nextm}},
                function(err,result){
               if (err) return next(err);
               console.log("push!!!!");
               //if (result) console.log(result);
            });

                
 
                /*
                if(existingmonth) if(existingmonth.length == 1){
                    Account.month.id(existingmonth[0]._id).remove();
                    existingmonth.remove({ _id: existingmonth[0]._id }, function(err){
                    if(err) return next(err);
                    });
                }
                else if(existingINI.length > 1){
                    for(var i = 0; i < existingmonth.length; i++){
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
             */
            //});
            
            
        if(i == acc.length -1) return res.redirect('/settleacc');
        }
    });
});

//结账


module.exports = router;