var express = require('express');
var router = express.Router();
var User = require('./user-model.js');
/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
   User.find(function(err, users) {
      res.send(users);
   });
});

router.get('/:id', function(req, res) {
   var id = req.params.id;
   User.findOne({'_id': new BSON.ObjectID(id)}, function(err, user) {
      res.send(user);
   });
});

router.post('/', function(req, res) {
    var item = req.body;
    console.log(JSON.stringify(item));
    item._id = null;
    new User(item).save();
    res.send(item);
});

module.exports = router;
