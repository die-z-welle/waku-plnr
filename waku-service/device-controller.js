var express = require('express');
var router = express.Router();
var Device = require('./device-model.js');

router.get('/', function(req, res) {
   Device.find(function(err, devices) {
      res.send(devices);
   });
});

router.get('/:id', function(req, res) {
   var id = req.params.id;
   Device.findOne({'_id': new BSON.ObjectID(id)}, function(err, device) {
      res.send(device);
   });
});

router.post('/', function(req, res) {
   var device = req.body;
   new Device(device).save();
});

module.exports = router;
