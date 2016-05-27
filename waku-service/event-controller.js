var express = require('express');
var router = express.Router();
var Event = require('./event-model.js');

/**
 * every route in this service starts with /events
 */
router.get('/', function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    if (startDate && endDate) {
        console.log('requested events between ' + startDate + " and " + endDate);
        Event.find({
            'from': {$gte: new Date(startDate).toISOString()},
            'to': {$lte: new Date(endDate).toISOString()}
        }, function(err, events) {
            res.send(events);
         });
    } else {
        console.log('requested all events');
        Event.find(function(err, events) {
         res.send(events);
        });
    }
});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    console.log('requested event ' + id);
    Event.findById(ObjectId(id)).exec(function(err, item) {
        res.send(item);
    });
});

router.post('/', function(req, res) {
    var event = req.body;
    event._id = null;
    new Event(event).save();
    res.send(event);
});

/*
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    console.log('delete event ' + id);
    collection.deleteOne({'_id': new BSON.ObjectID(id)}, function(err, item) {
        res.send(item);
    });
});
*/

module.exports = router;
