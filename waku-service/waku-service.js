var config  = require('./config.json');
var db      = require('./db.js');
var users   = require('./user-controller.js');
var events  = require('./event-controller.js');
var devices = require('./device-controller.js');
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var mqtt    = require('mqtt');
var client  = mqtt.connect(config.brokerURI);
var mongoose = require('mongoose');
var Device = require('./device-model.js');
var BSON = require('bson');

/**
   MONGODB
*/

mongoose.connect('mongodb://uldpafyzr74maae:jqHqowrD7dQy5KhOUO7c@bk2fgwjtdrjk2r9-mongodb.services.clever-cloud.com:27017/bk2fgwjtdrjk2r9');

/**
   MQTT
*/
client.on('connect', function() {
   client.subscribe(config.topic);
});

client.on('message', function(topic, message) {
   var device = JSON.parse(message);
   Device.findOne({'_id': device._id}, function(err, item) {
      if(!err) {
         if(!item) {
            item = new Device(device);
            io.emit('devices', JSON.stringify(item));
            console.log('new device created: ' + JSON.stringify(device));
         }
         item.state = device.state;
         item.save();
         io.emit('notifications', JSON.stringify(item));
         console.log('device state changed');
      } else {
         console.log('error finding device');
      }
   });


   /*
   var json = JSON.parse(message);
   if(find(json.id) == null) {
      console.log('[ INFO ] New device: ' + json.id)
      io.emit('devices', JSON.stringify(json));
   }
   save(json);
   io.emit('notifications', JSON.stringify(json));
   */
});

/**
   EXPRESS
*/

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/events', events);
app.use('/devices', devices);


/**
   SOCKET.IO
*/

io.on('connection', function(socket) {
   console.log('[ INFO ] Client connected');
   Device.find(function(err, devices) {
      console.log(JSON.stringify(devices));
      devices.forEach(function(data) {
         console.log(JSON.stringify(data));
         socket.emit('devices', JSON.stringify(data));
      });
   });
   /*
   iterate(function(data) {
      socket.emit('devices', JSON.stringify(data));
   });
   */
   socket.on('disconnect', function() {
      console.log('[ INFO ] Client disconnected');
   });
});

http.listen(config.port, function() {
   console.log('[ INFO ] Listening on port ' + config.port);
});
