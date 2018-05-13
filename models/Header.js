var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HeaderSchema = new Schema({
	code: { type: String, default: '', unique: true },
	name: { type: String, default: '', unique: false},

	AccountDocument: [{ type: Schema.Types.ObjectId, ref: 'AccountDocument' }]
});


module.exports = mongoose.model('Header', HeaderSchema);