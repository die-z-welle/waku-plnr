var express = require('express');
var router = express.Router();

var collectionname = 'events';

// TODO move this to db.js
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('waku-plnr-db', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to database");
        db.collection(collectionname, {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'measurements' collection doesn't exist - inserting one measurement");
                insertDummy();
            }
        });
    }
});

var insertDummy = function() {
    var measurement = {
                    id: 1,
                    sensor_id: 9119,
                    value: 327 //measurement value (0-1023)
                };
    db.collection(collectionname, function(err, collection) {
        collection.insert(measurement, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
            }
        });
    });
}

/**
 * every route in this service starts with /measurements
 */
router.post('/', function(req, res) {
    var measurement = req.body;
    console.log('posted measurement ' + JSON.stringify(event));
    db.collection(collectionname, function(err, collection) {
        collection.insert(event, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
});

module.exports = router;