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

var Twit = require('twit')
var credentials = require('../../credentials.json');
var T = new Twit(credentials);

/**
   MONGODB
*/
//mongoose.connect('mongodb://uldpafyzr74maae:jqHqowrD7dQy5KhOUO7c@bk2fgwjtdrjk2r9-mongodb.services.clever-cloud.com:27017/bk2fgwjtdrjk2r9');
mongoose.connect('mongodb://localhost');

/**
   MQTT
*/

client.on('connect', function() {
  client.subscribe(config.topic);
});

function tweet(screenname, state) {
  var template = (state === 'washing') ? config.messages.started : config.messages.finished;
  var account = (screenname.indexOf('@') === 0) ? screenname.substring(1) : screenname;
  var message = template.replace(config.messages.placeholder, account);
  T.post('direct_messages/new', { screen_name: account, text: message}, function(err, data, response) {
    console.log('sent twitter message');
  });
};

client.on('message', function(topic, message) {
   console.log(message);
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

         // TODO find current user and send tweet
         tweet('@aqulu1', device.state);
         console.log('device state changed');
      } else {
         console.log('error finding device');
      }
   });
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
