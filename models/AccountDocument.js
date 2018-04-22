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
<<<<<<< HEAD
	//录入日期
	documentdate: { type: Date, default: Date.now},
	//入账日期
	postingdate: { type: Date, default: Date.now},

	num: { type: String, default: '', unique: true },
	//日期
	date: { type: Date, default: Date.now },

=======
	//日期
	date: { type: Date, default: Date.now},
>>>>>>> parent of 42fbcdd... commit
	//制单人
	maker: { type: String, default: '' },
	//借方合计
	debitsum: { type: String, default: '0.00' },
	//贷方合计
	creditsum: { type: String, default: '0.00' },
	//审核状态
	checkstatus: { type: Boolean, default: false },
	//过账状态
	poststatus: { type: Boolean, default: false }

});

module.exports = mongoose.model('AccountDocument', AccountDocumentSchema);