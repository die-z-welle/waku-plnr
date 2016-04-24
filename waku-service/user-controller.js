var express = require('express');
var router = express.Router();

var collectionname = 'users';


// TODO move this to db.js
// var mongo = require('mongodb');
// var Server = mongo.Server,
//     Db = mongo.Db,
//     BSON = mongo.BSONPure;
// var server = new Server('localhost', 27017, {auto_reconnect: true});
// var db = new Db('waku-plnr-db', server);

// db.open(function(err, db) {
//     if(!err) {
//         console.log("Connected to database");
//         db.collection(collectionname, {strict:true}, function(err, collection) {
//             if (err) {
//                 console.log("The 'events' collection doesn't exist");
//             }
//         });
//     }
// });

/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
    // db.collection(collectionname, function(err, collection) {
    //     collection.find().toArray(function(err, items) {
    //         res.send(items);
    //     });
    // });
    console.log('requested all users');
    res.send(
        [
            {
                id: 1,
                firstname: 'Jim',
                lastname: 'Knopf'
            },
            {
                id: 2,
                firstname: 'Lukas',
                lastname: 'Der Lokomotivführer'
            }
        ]
    );
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    // db.collection(collectionname, function(err, collection) {
    //     collection.findOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
    //         res.send(item);
    //     });
    // });

    console.log('requested user ' + id);
    res.send(
        {
            id: 1,
            firstname: 'Jim',
            lastname: 'Knopf'
        }
    );
});

router.post('/', function(req, res) {
    var user = req.body;
    console.log('posted user ' + JSON.stringify(user));
    // db.collection(collectionname, function(err, collection) {
    //     collection.insert(user, {safe:true}, function(err, result) {
    //         if (err) {
    //             res.send({'error':'An error has occurred'});
    //         } else {
    //             console.log('Success: ' + JSON.stringify(result[0]));
    //             res.send(result[0]);
    //         }
    //     });
    // });
});

module.exports = router;