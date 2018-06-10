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
    BlnSheet.find({period: "201806"},
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

//生成资产负债表数据
router.get('/generatebl', function(req, res, next){
    var curryear = "2018", currmonth = "201806";                                           //var curryear = "2018", currmonth = "201805";
    BlnSheet.find({period: "template"}, function (err, blnitems) {
    Account.find({}, function(err, acc){
    var blndata = [];
    for(var j=0; j<blnitems.length; j++){
        var o = {};
        var cash = {};var short = {};var other = {};var stock = {};var intangible ={};
        cash.startbln = "0.00"; cash.endbln = "0.00";
        stock.startbln = "0.00"; stock.endbln = "0.00";
        other.startbln = "0.00"; other.endbln = "0.00";
        intangible.startbln = "0.00"; intangible.endbln = "0.00";
        short.startbln = "0.00"; short.endbln = "0.00";
        o.assproj  = blnitems[j].assproj;
        o.assnum  = blnitems[j].assnum;
        o.assendbln  = "";
        o.assstartbln  = "";
        o.liabproj  = blnitems[j].liabproj;
        o.liabnum  = blnitems[j].liabnum;
        o.liabendbln  = "";
        o.liabstartbln  = "";
        for(var i=0; i<acc.length; i++){
            //货币资金
            if(acc[i].code == '1001' || acc[i].code == '1002'
                || acc[i].code == '1003' ){
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
            if(acc[i].code == '1101' || acc[i].code == '1102' ){
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
            if(acc[i].code.indexOf("12") == 0 ){
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
            
            //无形资产intangible
            if(acc[i].code == '1801' || acc[i].code == '1805' ){
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
            if(acc[i].code == '1815' || acc[i].code == '1911' ){
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
            if((acc[i].name == o.assproj) || (("减："+acc[i].name) == o.assproj)
                || ((acc[i].name+"原值") == o.assproj)) {
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
           else if((acc[i].name == o.liabproj) || (("减："+acc[i].name) == o.liabproj)
                || ((acc[i].name+"（股本）") == o.liabproj)){
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
        o.period = currmonth;
        blndata.push(o);
    }
    console.log(blndata);
    
    for(var i=0; i<blndata.length; i++){
        var bln = new BlnSheet({
            period: blndata[i].period,
            assproj: blndata[i].assproj,
            assnum: blndata[i].assnum,
            assendbln: blndata[i].assendbln,
            assstartbln: blndata[i].assstartbln,
            liabproj: blndata[i].liabproj,
            liabnum: blndata[i].liabnum,
            liabendbln: blndata[i].liabendbln,
            liabstartbln: blndata[i].liabstartbln
        });
        bln.save(function(err){
            if(err) return next(err);
            console.log('New blnsheetitem has been created   ');
        });
    }
    return res.redirect('/');
    });
    });
});

router.get('/calculatebl', function(req, res, next){
    var curryear = "2018", currmonth = "201806";                                           //var curryear = "2018", currmonth = "201805";
    BlnSheet.find({period: "201806"}, function (err, blnitems) {
        for(var i=0; i< blnitems.length; i++){
            if(blnitems[i].assproj == "流动资产合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assnum>1) && (blnitems[j].assnum<15)){
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新流动资产合计成功")  }  });  
            }
            else if(blnitems[i].assproj == "长期投资合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assnum>16) && (blnitems[j].assnum<19)){
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}}; 
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新长期投资合计成功")  }  });  
            }
            else if (blnitems[i].assproj == "固定资产净额"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assproj == "固定资产原值")){
                        //加上固定资产原值
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                        for(var s=0; s<blnitems.length; s++){
                            if((blnitems[s].assproj == "减：累计折旧")){
                                //减去累计折旧
                                if((blnitems[s].assstartbln != "") && (blnitems[s].assstartbln != null))
                                {sum1 = parseFloat(sum1)-parseFloat(blnitems[s].assstartbln)+"";}
                                if((blnitems[s].assendbln != "") && (blnitems[s].assendbln != null))
                                {sum2 = parseFloat(sum2)-parseFloat(blnitems[s].assendbln)+"";}
                                for(var p=0; p<blnitems.length; p++){
                                    if(blnitems[p].assproj == "减：固定资产减值准备"){
                                        //减去固定资产减值准备
                                        if((blnitems[p].assstartbln != "") && (blnitems[p].assstartbln != null))
                                        {sum1 = parseFloat(sum1)-parseFloat(blnitems[p].assstartbln)+"";}
                                        if((blnitems[p].assendbln != "") && (blnitems[p].assendbln != null))
                                        {sum2 = parseFloat(sum2)-parseFloat(blnitems[p].assendbln)+"";}
                                    }
                                }
                            }
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}}; 
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新固定资产净额成功")  }  });  
            }
            else if(blnitems[i].assproj == "固定资产净值"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assproj == "固定资产原值")){
                        //加上固定资产原值
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                        for(var s=0; s<blnitems.length; s++){
                            if((blnitems[s].assproj == "减：累计折旧")){
                                //减去累计折旧
                                if((blnitems[s].assstartbln != "") && (blnitems[s].assstartbln != null))
                                {sum1 = parseFloat(sum1)-parseFloat(blnitems[s].assstartbln)+"";}
                                if((blnitems[s].assendbln != "") && (blnitems[s].assendbln != null))
                                {sum2 = parseFloat(sum2)-parseFloat(blnitems[s].assendbln)+"";}
                            }
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新固定资产净值成功")  }  });  
            }
            else if(blnitems[i].assproj == "固定资产合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assnum>20) && (blnitems[j].assnum<29) 
                        && (blnitems[j].assnum!=23) && (blnitems[j].assnum!=25)){
                        if((blnitems[j].assnum==22) || (blnitems[j].assnum==24)){
                            //减去累计折旧和固定资产减值准备
                            if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                            {sum1 = parseFloat(sum1)-parseFloat(blnitems[j].assstartbln)+"";}
                            if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                            {sum2 = parseFloat(sum2)-parseFloat(blnitems[j].assendbln)+"";}
                        } else{
                            if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                            {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                            if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                            {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新固定资产合计成功")  }  });
            }
            else if(blnitems[i].assproj == "无形资产及其他资产合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assnum>30) && (blnitems[j].assnum<34)){
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新无形资产及其他资产合计成功")  }  });  
            }
            else if(blnitems[i].assproj == "资产总额"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].assnum>1) && (blnitems[j].assnum<37)){
                        if ((blnitems[j].assnum==15) || (blnitems[j].assnum==16) || (blnitems[j].assnum==19) 
                        ||(blnitems[j].assnum==20)||(blnitems[j].assnum==23)||(blnitems[j].assnum==25)||
                        (blnitems[j].assnum==29)||(blnitems[j].assnum==30)||(blnitems[j].assnum==34)){
                            continue;
                        }
                        if((blnitems[j].assnum==22)||(blnitems[j].assnum==23)){
                            if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                            {sum1 = parseFloat(sum1)-parseFloat(blnitems[j].assstartbln)+"";}
                            if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                            {sum2 = parseFloat(sum2)-parseFloat(blnitems[j].assendbln)+"";}
                        }  else {
                        if((blnitems[j].assstartbln != "") && (blnitems[j].assstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].assstartbln)+"";}
                        if((blnitems[j].assendbln != "") && (blnitems[j].assendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].assendbln)+"";}
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {assstartbln: sum1, assendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新资产总额成功")  }  });  
            }
            if(blnitems[i].liabproj == "流动负债合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabnum>38) && (blnitems[j].liabnum<53)){
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};  
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新流动负债合计成功")  }  });  
            }
            else if(blnitems[i].liabproj == "长期负债合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabnum>54) && (blnitems[j].liabnum<60)){
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新长期负债合计成功")  }  });  
            }
            else if(blnitems[i].liabproj == "负债合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabnum>38) && (blnitems[j].liabnum<63)){
                        if((blnitems[j].liabnum==53)||(blnitems[j].liabnum==54)||
                        (blnitems[j].liabnum==60)){
                            continue;
                        }
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新负债合计成功")  }  });  
            }
            else if(blnitems[i].liabproj == "所有者权益（或股东权益）合计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabnum>64) && (blnitems[j].liabnum<72)){
                        if(blnitems[j].liabnum==67){
                            continue;
                        }
                        if(blnitems[j].liabnum==66){
                            if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                            {sum1 = parseFloat(sum1)-parseFloat(blnitems[j].liabstartbln)+"";}
                            if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                            {sum2 = parseFloat(sum2)-parseFloat(blnitems[j].liabendbln)+"";}
                        }  else {
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新所有者权益（或股东权益）合计成功")  }  });  
            }
            else if(blnitems[i].liabproj == "实收资本（股本）净额"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabproj == "实收资本（股本）")){
                        //加上实收资本（股本）
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                        for(var s=0; s<blnitems.length; s++){
                            if((blnitems[s].liabproj == "减：已归还投资")){
                                //减去已归还投资
                                if((blnitems[s].liabstartbln != "") && (blnitems[s].liabstartbln != null))
                                {sum1 = parseFloat(sum1)-parseFloat(blnitems[s].liabstartbln)+"";}
                                if((blnitems[s].liabendbln != "") && (blnitems[s].liabendbln != null))
                                {sum2 = parseFloat(sum2)-parseFloat(blnitems[s].liabendbln)+"";}
                            }
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新实收资本（股本）净额成功")  }  });  
            }
            else if(blnitems[i].liabproj == "负债及所有者权益总计"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<blnitems.length; j++){
                    if((blnitems[j].liabnum>38) && (blnitems[j].liabnum<72)){
                        if ((blnitems[j].liabnum==53) || (blnitems[j].liabnum==54) || (blnitems[j].liabnum==60) 
                        ||(blnitems[j].liabnum==63)||(blnitems[j].liabnum==64)||(blnitems[j].liabnum==67)){
                            continue;
                        }
                        if((blnitems[j].liabnum==66)){
                            if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                            {sum1 = parseFloat(sum1)-parseFloat(blnitems[j].liabstartbln)+"";}
                            if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                            {sum2 = parseFloat(sum2)-parseFloat(blnitems[j].liabendbln)+"";}
                        }  else {
                        if((blnitems[j].liabstartbln != "") && (blnitems[j].liabstartbln != null))
                        {sum1 = parseFloat(sum1)+parseFloat(blnitems[j].liabstartbln)+"";}
                        if((blnitems[j].liabendbln != "") && (blnitems[j].liabendbln != null))
                        {sum2 = parseFloat(sum2)+parseFloat(blnitems[j].liabendbln)+"";}
                        }
                    }
                }
                var conditions = {_id: blnitems[i]._id};  
                var updates = {$set: {liabstartbln: sum1, liabendbln: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新负债及所有者权益总计成功")  }  });  
            }
        }
        return res.redirect('/');
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

router.get('/generatepl', function(req, res, next){
    var curryear = "2018", currmonth = "201806";                                           //var curryear = "2018", currmonth = "201805";
    PlSheet.find({period: "template"}, function (err, plitems) {
    Account.find({}, function(err, acc){
    var pldata = [];
    for(var j=0; j<plitems.length; j++){
        var o = {};
        o.plproj = plitems[j].plproj;
        o.plnum  = plitems[j].plnum;
        o.plmonthamt  = "";
        o.plyearamt  = "";
        o.period = currmonth;
        var incomey = "", incomem = "", outflowy = "", outflowm = "";
        for(var i=0; i<acc.length; i++){
          if((acc[i].name == o.plproj) || (o.plproj.indexOf(acc[i].name)!=-1)) {
           //找到了对应
           for(var s=0; s<acc[i].year.length; s++){
                if(acc[i].year[s].num == curryear){
                    o.plyearamt = acc[i].year[s].endbln;
                }
           }
           for(var s=0; s<acc[i].month.length; s++){
            if(acc[i].month[s].num == currmonth){
                o.plmonthamt = acc[i].month[s].endbln;
            }
           }
         }
         else if(acc[i].name == "其他业务收入"){
            for(var s=0; s<acc[i].year.length; s++){
                if(acc[i].year[s].num == curryear){
                    incomey = acc[i].year[s].endbln;
                }
           }
           for(var s=0; s<acc[i].month.length; s++){
            if(acc[i].month[s].num == currmonth){
                incomem = acc[i].month[s].endbln;
            }
           }
         }
         else if(acc[i].name == "其他业务支出"){
            for(var s=0; s<acc[i].year.length; s++){
                if(acc[i].year[s].num == curryear){
                    outflowy = acc[i].year[s].endbln;
                }
           }
           for(var s=0; s<acc[i].month.length; s++){
            if(acc[i].month[s].num == currmonth){
                outflowm = acc[i].month[s].endbln;
            }
           }
         }
        }
        if(o.plproj == "加：其他业务利润") {
            o.plyearamt = parseFloat(incomey)-parseFloat(outflowy)+"";
            o.plmonthamt = parseFloat(incomem)-parseFloat(outflowm)+"";
        }
        pldata.push(o);
    }
    console.log(pldata);
    /*
    for(var i=0; i<pldata.length; i++){
        var pl = new PlSheet({
            period: pldata[i].period,
            plproj: pldata[i].plproj,
            plnum: pldata[i].plnum,
            plmonthamt: pldata[i].plmonthamt,
            plyearamt: pldata[i].plyearamt
        });
        pl.save(function(err){
            if(err) return next(err);
            console.log('New plsheetitem has been created   ');
        });
    }
    */
    });
});
});

router.get('/calculatepl', function(req, res, next){
    var curryear = "2018", currmonth = "201801";
    PlSheet.find({period: "template"}, function (err, plitems) {
        for(var i=0;i<plitems.length;i++){
            if(plitems.plproj == "二、主营业务利润"){
                var sum1 = "0.00"; var sum2 = "0.00";
                for(var j=0; j<plitems.length; j++){
                    if((plitems[j].plnum>0)&&(plitems[j].plnum<5)){
                        if(plitems[j].plnum==1){
                            if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                            {sum1 = parseFloat(sum1)+parseFloat(plitems[j].plmonthamt)+"";}
                            if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                            {sum2 = parseFloat(sum2)+parseFloat(plitems[j].plyearamt)+"";}
                        }
                        else{
                            if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                            {sum1 = parseFloat(sum1)-parseFloat(plitems[j].plmonthamt)+"";}
                            if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                            {sum2 = parseFloat(sum2)-parseFloat(plitems[j].plyearamt)+"";}
                        }
                    }
                }
                var conditions = {_id: plitems[i]._id};  
                var updates = {$set: {plmonthamt: sum1, plyearamt: sum2}};
                BlnSheet.update(conditions, updates, function (error) {  
                    if (error) {  console.error(error);  
                    } else {  console.log("更新主营业务利润成功")  }  });  
                }
                else if(plitems.plproj == "三、营业利润"){
                    var sum1 = "0.00"; var sum2 = "0.00";
                    for(var j=0; j<plitems.length; j++){
                        if((plitems[j].plnum>0)&&(plitems[j].plnum<9)){
                            if(plitems[j].plnum==5) {continue;}
                            else if((plitems[j].plnum==1) || (plitems[j].plnum==6)){
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)+parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)+parseFloat(plitems[j].plyearamt)+"";}
                            }
                            else{
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)-parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)-parseFloat(plitems[j].plyearamt)+"";}
                            }
                        }
                    }
                    var conditions = {_id: plitems[i]._id};  
                    var updates = {$set: {plmonthamt: sum1, plyearamt: sum2}};
                    BlnSheet.update(conditions, updates, function (error) {  
                        if (error) {  console.error(error);  
                        } else {  console.log("更新营业利润成功")  }  });  
                }
                else if(plitems.plproj == "四、利润总额"){
                    var sum1 = "0.00"; var sum2 = "0.00";
                    for(var j=0; j<plitems.length; j++){
                        if((plitems[j].plnum>0)&&(plitems[j].plnum<15)){
                            if((plitems[j].plnum==5)||(plitems[j].plnum==9)) {continue;}
                            else if((plitems[j].plnum==1) || (plitems[j].plnum==6)||
                                    (plitems[j].plnum==10) || (plitems[j].plnum==11) || 
                                    (plitems[j].plnum==12) || (plitems[j].plnum==14)){
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)+parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)+parseFloat(plitems[j].plyearamt)+"";}
                            }
                            else{
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)-parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)-parseFloat(plitems[j].plyearamt)+"";}
                            }
                        }
                    }
                    var conditions = {_id: plitems[i]._id};  
                    var updates = {$set: {plmonthamt: sum1, plyearamt: sum2}};
                    BlnSheet.update(conditions, updates, function (error) {  
                        if (error) {  console.error(error);  
                        } else {  console.log("更新利润总额成功")  }  });  
                }
                else if(plitems.plproj == "五、净利润"){
                    var sum1 = "0.00"; var sum2 = "0.00";
                    for(var j=0; j<plitems.length; j++){
                        if((plitems[j].plnum>0)&&(plitems[j].plnum<15)){
                            if((plitems[j].plnum==5)||(plitems[j].plnum==9)||(plitems[j].plnum==15)) {continue;}
                            else if((plitems[j].plnum==1) || (plitems[j].plnum==6)||
                                    (plitems[j].plnum==10) || (plitems[j].plnum==11) || 
                                    (plitems[j].plnum==12) || (plitems[j].plnum==14)){
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)+parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)+parseFloat(plitems[j].plyearamt)+"";}
                            }
                            else{
                                if((plitems[j].plmonthamt != "") && (plitems[j].plmonthamt != null))
                                {sum1 = parseFloat(sum1)-parseFloat(plitems[j].plmonthamt)+"";}
                                if((plitems[j].plyearamt != "") && (plitems[j].plyearamt != null))
                                {sum2 = parseFloat(sum2)-parseFloat(plitems[j].plyearamt)+"";}
                            }
                        }
                    }
                    var conditions = {_id: plitems[i]._id};  
                    var updates = {$set: {plmonthamt: sum1, plyearamt: sum2}};
                    BlnSheet.update(conditions, updates, function (error) {  
                        if (error) {  console.error(error);  
                        } else {  console.log("更新净利润成功")  }  });  
                }
        }
    });
});

module.exports = router;