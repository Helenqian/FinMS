var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//每次初始化前，将该表中全部数据删除
var InitialSchema = new Schema({
    //起始年份
    startyear: { type: String, default: '0000'},
    //起始日期默认从1月1日开始

    //凭证起始号
    base: { type: Number},
    
    //凭证当前号
    currnum: { type: Number}
});


module.exports = mongoose.model('Initial', InitialSchema);