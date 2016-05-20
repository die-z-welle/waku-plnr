var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
   _id: String,
   from: Date,
   to: Date,
   user_id: ObjectId
});

module.exports = mongoose.model('Event', EventSchema);
