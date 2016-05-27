var mongoose = require('mongoose'),
   Schema = mongoose.Schema;


var UserSchema = new Schema({
   firstname: String,
   lastname: String,
   twitter_id: String
});

module.exports = mongoose.model('User', UserSchema);
