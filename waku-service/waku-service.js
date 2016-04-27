var config  = require('./config.json');
var db      = require('./db.js');
var users   = require('./user-controller.js');
var events  = require('./event-controller.js');
var express = require('express');
var app     = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var mqtt    = require('mqtt');
var client  = mqtt.connect(config.brokerURI);

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

app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/events', events);

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
