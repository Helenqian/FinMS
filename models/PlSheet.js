var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlSheetSchema = new Schema({

    period: {type: String, unique: false},
    plproj: { type: String, default:''},
    plnum: { type: Number },
    plmonthamt: { type: String, default:'' },
    plyearamt: { type: String, default:'' }

});

module.exports = mongoose.model('PlSheet', PlSheetSchema);

