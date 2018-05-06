var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
var AmountSchema = new Schema({
    month:[{ 
        monthnum: {type: String, default: '0'},
        monthstart: {type: String, default: '0.00'},
        monthend: {type: String, default: '0.00'},
        monthdebit: {type: String, default: '0.00'},
        monthcredit: {type: String, default: '0.00'}
    }],
    year:[{ 
        yearnum: {type: String, default: '0000'},
        yearstart: {type: String, default: '0.00'},
        yearend: {type: String, default: '0.00'},
        yeardebit: {type: String, default: '0.00'},
        yearcredit: {type: String, default: '0.00'}
    }]

});

module.exports = mongoose.model('AccountDocument', AccountDocumentSchema);