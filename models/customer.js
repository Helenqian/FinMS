var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* The Customer schema attributes / charateristics / fields */
/* 客户模式 属性 / 特性 / 字段 */
var CustomerSchema = new Schema({
	//category: { type: Schema.Types.ObjectId, ref: 'Category'},
	email: { type: String, unique: true, lowercase: true},
	phone: String,
	name: String,
	//sex: String,
	address: String,
	company: String,
	/*history: [{
		date: Date,
		paid: { type: Number, default: 0},
		//item: { type: Schema.Types.ObjectId, ref: ''}
	}]*/
});

 
module.exports = mongoose.model('Customer', CustomerSchema);