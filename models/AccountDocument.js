var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var AccountDocumentSchema = new Schema({

	//凭证项目
	DocumentItem: [{
		//借方金额
		debit: { type: String, default: '0.00' },
		//贷方金额
		credit: { type: String, default: '0.00' },
		//摘要
		header: { type: Schema.Types.ObjectId, ref: 'Header' },
		//科目
		account: { type: Schema.Types.ObjectId, ref: 'Account' }
	}],

	//凭证号
	num: { type: String, default: '', unique: true},

	//录入日期
	docdate: { type: String, default: '0000-00-00'},
	//入账日期
	postdate: { type: String, default: '0000-00-00'},

	//制单人
	maker: { type: String, default: '' },
	//借方合计
	debitsum: { type: String, default: '0.00' },
	//贷方合计
	creditsum: { type: String, default: '0.00' },
	//审核状态
	checkstatus: { type: String, default: 'false' },
	//过账状态
	poststatus: { type: String, default: 'false' },
	//凭证类型(现金凭证/银行凭证/转账凭证)
	type: { type:String }

	//凭证起始号
	//base: { type: Number, default:1000 },

	//DocumentItem: [{ type: Schema.Types.ObjectId, ref: 'DocumentItem' }]

});

module.exports = mongoose.model('AccountDocument', AccountDocumentSchema);