var express = require('express');
var router = express.Router();

var eventColl = 'events';

// TODO move this to db.js
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db;
var BSON = require('bson').BSONPure;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('waku-plnr-db', server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to database");
        // db.dropCollection(eventColl);
        // db.createCollection(eventColl);
    }
});

var collection = db.collection(eventColl);
var insertDummy = function() {
    var event = {
                    _id: null,
                    from: new Date(2016, 05, 02, 6, 0, 0, 0),
                    to: new Date(2016, 05, 02, 13, 0, 0, 0),
                    user_id: 1
                };
    collection.insert(event, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result[0]));
        }
    });
};

/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    var result;
    if (startDate && endDate) {
        console.log('requested events between ' + startDate + " and " + endDate);
        result = collection.find({
            'from': {$gte: new Date(startDate).toISOString()},
            'to': {$lte: new Date(endDate).toISOString()}
        });
    } else {
        console.log('requested all events');
        result = collection.find();
    }
    result.toArray(function(err, items) {
        res.send(items);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    console.log('requested event ' + id);
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
    });
});

router.post('/', function(req, res) {
    var event = req.body;
    event._id = null;
    collection.insertOne(event, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result[0]));
            res.send(result[0]);
        }
    });
});

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log('delete event ' + id);
    collection.deleteOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
    });
});

module.exports = router;