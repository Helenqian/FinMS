var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* The Customer schema attributes / charateristics / fields */
/* 客户模式 属性 / 特性 / 字段 */
var CustomerSchema = new Schema({
	//category: { type: Schema.Types.ObjectId, ref: 'Category'},
	email: { type: String, unique: true, lowercase: true},
	phone: String,
	name: String,
	sex: {type: String, default:'未知'},
	address: String,
	company: String,
	salesmann: { type: Schema.Types.ObjectId, ref: 'User'},
	salesman: {type: String, default:'王骞'},
	tradeinfo: {type: String, default:'潜在客户'}
	/*history: [{
		date: Date,
		paid: { type: Number, default: 0},
		//item: { type: Schema.Types.ObjectId, ref: ''}
	}]*/
});

 
module.exports = mongoose.model('Customer', CustomerSchema);