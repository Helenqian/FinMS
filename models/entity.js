var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var entitySchema = Schema({
testvalue: {type: String}
});

entitySchema.pre('save', function(next) {
	var doc = this;
	counter.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter) {
		if(error)
		return next(error);
		doc.testvalue = counter.seq;
		next();
		});
});

var entity = mongoose.model('entity', entitySchema);