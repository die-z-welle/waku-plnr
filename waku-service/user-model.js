var mongoose = require('mongoose'),
   Schema = mongoose.Schema;


var UserSchema = new Schema({
   _id: String,
   firstname: String,
   lastname: String,
   twitter_id: String
});

module.exports = mongoose.model('User', UserSchema);
