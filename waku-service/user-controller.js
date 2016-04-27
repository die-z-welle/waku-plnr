var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db;
var BSON = require('bson').BSONPure;


var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('waku-plnr-db', server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to database");
        // collection.insertMany([
        //     {
        //         _id: null,
        //         firstname: 'Jim',
        //         lastname: 'Knopf',
        //         twitter_id: null
        //     },
        //     {
        //         _id: null,
        //         firstname: 'Lukas',
        //         lastname: 'Der Lokomotivführer',
        //         twitter_id: null
        //     }
        // ]);
        // db.dropCollection(userColl);
        // db.createCollection(userColl);
    }
});
var userColl = 'users';
var collection = db.collection(userColl);

/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
    collection.find().toArray(function(err, items) {
        res.send(items);
    });
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
    });
});

router.post('/', function(req, res) {
    var user = req.body;
    user._id = null;
    collection.insertOne(user, {safe:true}, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            console.log('Success: ' + JSON.stringify(result[0]));
            res.send(result[0]);
        }
    });
});

module.exports = router;