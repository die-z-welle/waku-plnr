hoursToMillis = function(hours) {
   return hours * 60 * 60 * 1000;
}

getRandomNumber = function(from, to) {
   return Math.floor((Math.random() * to) + from);
}
