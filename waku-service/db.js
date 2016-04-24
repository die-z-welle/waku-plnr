var db = {};

save = function(data) {
   db[data.id] = data.state;
}

find = function(id) {
   if(!db.hasOwnProperty(id)) {
      return null;
   }
      
   var json = {};
   json.id = id;
   json.state = db[id];
   return json;
}

clear = function() {
   db = {};
}

iterate = function(func) {
   for(var key in db) {      
      func(find(key));
   }
}
