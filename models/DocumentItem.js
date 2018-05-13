var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var DocumentItemSchema = new Schema({

    //id
    id: { type: String, default:'', unique: true},
    //凭证号
	num: { type: String, default: ''},
	//借方金额
	debit: { type: String, default: '0.00' },
	//贷方金额
	credit: { type: String, default: '0.00' },
	//摘要
	header: { type: Schema.Types.ObjectId, ref: 'Header' },
	//科目
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
	//年
	yearnum: {type: String, default: '0000'},
	//月
	monthnum: {type: String, default: '000000'}

});

module.exports = mongoose.model('DocumentItem', DocumentItemSchema);