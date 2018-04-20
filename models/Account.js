var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
	code: { type: String, default: '', unique: true },
	name: { type: String, default: '', unique: true },

	AccountDocument: [{ type: Schema.Types.ObjectId, ref: 'AccountDocument' }]
});


module.exports = mongoose.model('Account', AccountSchema);

