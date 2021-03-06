var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	code: { type: String, default: '', unique: true },
	name: { type: String, default: '', unique: true },
	//属于资产类(Assets)/负债类(Debts)/所有者权益类(Equity)
	type: { type: String, default: ''},
	//科目
	month:[{ 
        num: {type: String, default: '000000'},
        //期初余额
        startbln: {type: String, default: '0.00'},
        //期末余额
        endbln: {type: String, default: '0.00'},
        //本月借方发生额
        debamount: {type: String, default: '0.00'},
        //本月贷方发生额
        credamount: {type: String, default: '0.00'},
        //是否已月底结账
        settlestatus: {type: String, default: 'false'},
        //余额方向(借/贷)
        blndirect: {type: String, default:''}

    }],
    year:[{ 
        num: {type: String, default: '0000'},
		//年初余额
		startbln: {type: String, default: '0.00'},
		//年末余额
		endbln: {type: String, default: '0.00'},
		//本年借方发生额
		debamount: {type: String, default: '0.00'},
		//本年贷方发生额
		credamount: {type: String, default: '0.00'},
		//是否已年底结账
		settlestatus: {type: String, default: 'false'},
		//余额方向(借/贷)
		blndirect: {type: String, default:''}
    }],

	DocumentItem: [{ type: Schema.Types.ObjectId, ref: 'DocumentItem'}]
});


module.exports = mongoose.model('Account', AccountSchema);

