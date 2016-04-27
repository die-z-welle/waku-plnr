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
                console.log("The 'events' collection doesn't exist - inserting one event");
                insertDummy();
            }
        });
    }
});

var insertDummy = function() {
    var event = {
                    id: 1,
                    from: new Date(2016, 05, 02, 6, 0, 0, 0),
                    to: new Date(2016, 05, 02, 13, 0, 0, 0),
                    user_id: 1
                };
    db.collection(collectionname, function(err, collection) {
        collection.insert(event, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
            }
        });
    });
}

/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    console.log('requested all events');
    db.collection(collectionname, function(err, collection) {
        var result;
        if (startDate && endDate) {
            result = collection.find({
                'from': {$gte: ISODate(startDate)},
                'to': {$lte: ISODate(endDate)}
            });
        } else {
            result = collection.find();            
        }
        result.toArray(function(err, items) {
            res.send(items);
        });
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    console.log('requested event ' + id);
    db.collection(collectionname, function(err, collection) {
        collection.findOne({'id': parseInt(id)}, function(err, item) {
            res.send(item);
        });
    });
});

router.post('/', function(req, res) {
    var event = req.body;
    console.log('posted event ' + JSON.stringify(event));
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

router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log('delete event ' + id);
    db.collection(collectionname, function(err, collection) {
        collection.deleteOne({'id': parseInt(id)}, function(err, item) {
            res.send(item);
        });
    });
});


module.exports = router;