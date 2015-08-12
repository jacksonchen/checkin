var readlineSync = require('readline-sync'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
var fs = require('fs'),
    config = require('config');

var accessDB = function(ID) {
  var hostName = config.get('db.hostname'),
      portNumber = config.get('db.port'),
      dbName = config.get('db.dbname'),
      collectionName = config.get('db.collection'),
      user = config.get('db.user'),
      password = config.get('db.password');
  var mongoURL = 'mongodb://' + user + ':' + password + '@' + hostName + ':' + portNumber + '/' + dbName;

  MongoClient.connect(mongoURL, function(err, db) {
    assert.equal(null, err);
    console.log("accessDB::Connected correctly to server");
    var collection = db.collection(collectionName);

    readInput(collection);

  });
}

var readInput = function(collection) {
  var response = readlineSync.question('Command: ');
  if (response === "reset") {
    collection.update({}, {$set: {checkedin: false}}, { multi: true }, function(err, docs) {
      assert.equal(err, null);
      console.log("Every student's checkin status reset.")
      readInput(collection);
    })
  }
  else if (response === "stop") {
    console.log("Good bye");
    process.exit();
  }
  else if (response === "help") {
    console.log("<student id>: Changes a student's checkin status to true.");
    console.log("reset: Changes all student's checkin statuses to false.");
    console.log("stop: Ends the program.");
    readInput(collection);
  }
  else {
    findDoc(response, collection, function() {
      readInput(collection);
    });
  }
}

var findDoc = function(ID, collection, callback) {
  collection.find({'ID': ID}).toArray(function(err, docs) {
    assert.equal(err, null);
    if (docs.length == 0) {
      console.error("Student not found.");
      callback();
    }
    else {
      name = docs[0].name
      collection.update({'ID': ID }, {name: name, 'ID': ID, checkedin: true}, { upsert: true }, function(err, docs) {
        assert.equal(err, null);
        console.log(name + " was successfully checked in.")
        callback();
      })
    }

  });
}

accessDB();
