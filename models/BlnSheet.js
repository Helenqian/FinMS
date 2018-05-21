var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BlnSheetSchema = new Schema({

    period: {type: String, unique: false},
    assproj: { type: String, default:''},
    assnum: { type: Number },
    assendbln: { type: String, default:'' },
    assstartbln: { type: String, default:'' },
    liabproj: { type: String, default:''},
    liabnum: { type: Number },
    liabendbln: { type: String, default:'' },
    liabstartbln: { type: String, default:'' }

});

module.exports = mongoose.model('BlnSheet', BlnSheetSchema);

