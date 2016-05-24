var config  = require('./config.json');
var util    = require('./util.js');
var mqtt    = require('mqtt');
var threads = require('webworker-threads');
var pool = threads.createPool(config.numberOfWashingmachines);

config.washingTimeInMillis = hoursToMillis(config.washingTimeInHours);

pool.all.eval('washingmachines', function(err, data) {
   
   var info = { 
      _id : this.id,
      location: '',
      state : 'idle'
   }
   
   var client = mqtt.connect(config.brokerURI);

   client.on('connect', function() {
      client.publish(config.topic, JSON.stringify(info));
      wait();
   });

   function wait() {
      changeState('idle');
      setTimeout(wash, hoursToMillis(getRandomNumber(1, 5)) / config.simulationSpeed);
   }

   function wash() {
      changeState('washing');
      setTimeout(wait, config.washingTimeInMillis / config.simulationSpeed);
   }
   
   function changeState(state) {
      if(info.state === state)
         return
      info.state = state;
      client.publish(config.topic, JSON.stringify(info));
   }
});
