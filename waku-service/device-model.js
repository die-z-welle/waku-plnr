var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

var DeviceSchema = new Schema({
   _id: String,
   location: String,
   state: String
});

module.exports = mongoose.model('Device', DeviceSchema);
