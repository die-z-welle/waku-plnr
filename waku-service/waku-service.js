var config  = require('./config.json');
var db      = require('./db.js');
var users   = require('./user-controller.js');
var events  = require('./event-controller.js');
var express = require('express');
var bodyParser = require('body-parser');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var mqtt    = require('mqtt');
var client  = mqtt.connect(config.brokerURI);
var mongoose = require('mongoose');

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
   var json = JSON.parse(message);
   if(find(json.id) == null) {
      console.log('[ INFO ] New device: ' + json.id)
      io.emit('devices', JSON.stringify(json));
   }
   save(json);
   io.emit('notifications', JSON.stringify(json));
});

/**
   EXPRESS
*/

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/events', events);


/**
   SOCKET.IO
*/

io.on('connection', function(socket) {
   console.log('[ INFO ] Client connected');
   iterate(function(data) {
      socket.emit('devices', JSON.stringify(data));
   });

   socket.on('disconnect', function() {
      console.log('[ INFO ] Client disconnected');
   });
});

http.listen(config.port, function() {
   console.log('[ INFO ] Listening on port ' + config.port);
});
