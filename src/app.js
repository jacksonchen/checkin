var readlineSync = require('readline-sync'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var fs = require('fs'),
    config = require('config'),
    event = null;

var accessDB = function() {
  var hostName = config.get('db.hostname'),
      portNumber = config.get('db.port'),
      dbName = config.get('db.dbname'),
      memberscollection = config.get('db.memberscollection'),
      eventscollection = config.get('db.eventscollection'),
      user = config.get('db.user'),
      password = config.get('db.password');
  var mongoURL = 'mongodb://' + user + ':' + password + '@' + hostName + ':' + portNumber + '/' + dbName;

  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("accessDB::Connected correctly to server");

    readInput(db.collection(memberscollection), db.collection(eventscollection));
  });
}

var readInput = function(memberscollection, eventscollection) {
  var response = readlineSync.question('Command: ');
  if (response === "reset") {
    if (event === null) {
      console.log("Please set an event before checking in members.");
      readInput(memberscollection, eventscollection);
    }
    else {
      resetEvent(memberscollection, event, function() {
        readInput(memberscollection, eventscollection);
      })
    }
  }
  else if (response === "stop") {
    console.log("Good bye");
    process.exit();
  }
  else if (response === "help") {
    console.log("event <eventName|all>: Type an eventname to change the event. All to show all events. If blank, shows the current event.");
    console.log("<student id>: Changes a student's checkin status to true.");
    console.log("reset: Changes all students' checkin statuses in the current event to false.");
    console.log("stop: Ends the program.");
    readInput(memberscollection, eventscollection);
  }
  else if (response.substring(0,5) === "event") {
    if (response.length <= 6) {
      console.log("Event is " + event)
      readInput(memberscollection, eventscollection);
    }
    else if (response.substring(6) === "all") {
      eventscollection.find().toArray(function(err, docs) {
        assert.equal(err, null);
        var eventsList = docs.map(function(val) { return val.name });
        console.log(eventsList);
        readInput(memberscollection, eventscollection);
      });
    }
    else {
      event = response.substring(6);
      eventscollection.find({name: event}).toArray(function(err, docs) {
        assert.equal(err, null)
        if (docs.length === 0) {
          eventscollection.insert({name: event}, function(err, docs) {
            assert.equal(err, null);
            resetEvent(memberscollection, event, function() {
              console.log("Created new event " + event);
              console.log("Switched to event " + event);
              readInput(memberscollection, eventscollection);
            });
          });
        }
        else {
          console.log("Switched to event " + event);
          readInput(memberscollection, eventscollection);
        }

      })

    }

  }
  else {
    if (event === null) {
      console.log("Please set an event before checking in members.");
      readInput(memberscollection, eventscollection);
    }
    else {
      findMember(response, memberscollection, function() {
        readInput(memberscollection, eventscollection);
      });
    }
  }
}

var resetEvent = function(memberscollection, event, callback) {
  var resetted = {};
      resetted[event] = false;

  memberscollection.update({}, {$set: resetted}, { multi: true }, function(err, docs) {
    assert.equal(err, null);
    console.log("Every student's checkin status reset.")
    callback();
  })
}

var findMember = function(ID, memberscollection, callback) {
  memberscollection.find({'ID': ID}).toArray(function(err, docs) {
    assert.equal(err, null);
    if (docs.length === 0) {
      console.error("Student not found.");
      callback();
    }
    else {
      var name = docs[0].name;
      var updated = {};
      updated[event] = true;
      memberscollection.update({'ID': ID }, {$set: updated}, { upsert: true }, function(err, docs) {
        assert.equal(err, null);
        console.log(name + " was successfully checked in.")
        callback();
      })
    }

  });
}

accessDB();
