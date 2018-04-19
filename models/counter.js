var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema = Schema({
_id: {type: String, required: true},
seq: { type: Number, default: 0 }
});

var counter = mongoose.model('counter', CounterSchema);
