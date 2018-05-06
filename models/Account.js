var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	code: { type: String, default: '', unique: true },
	name: { type: String, default: '', unique: true },
	//属于资产类/负债类/所有者权益类
	dctype: { type: String, default: ''},
	//科目
	month:[{ 
        monthnum: {type: String, default: '0'},
        monthstart: {type: String, default: '0.00'},
        monthend: {type: String, default: '0.00'},
        monthamount: {type: String, default: '0.00'},
    }],
    year:[{ 
        yearnum: {type: String, default: '0000'},
        yearstart: {type: String, default: '0.00'},
        yearend: {type: String, default: '0.00'},
        yearamount: {type: String, default: '0.00'},
    }],

	AccountDocument: [{ type: Schema.Types.ObjectId, ref: 'AccountDocument' }]
});


module.exports = mongoose.model('Account', AccountSchema);

