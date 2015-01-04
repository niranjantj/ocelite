var debug = require('debug')('ocelite');
var async = require('async');
var sqlite3 = require('sqlite3').verbose();

var Db = function() {
  var self = this;

  this.init = function(file, store, cb) {
    self._db = new sqlite3.Database(file);
    initSchema(store, cb);
  };

  this.save = function(store, data, cb) {
    self._db.run('INSERT INTO ' + store+ '(data) VALUES (?)', JSON.stringify(data), cb);
  };

  var initSchema = function(store, cb) {
    async.map(store, initTable, cb);
  };

  var initTable = function(table, cb) {
    var query = "SELECT name FROM sqlite_master WHERE type='table' AND name='" + table + "';";
    var createTable = "CREATE TABLE " + table + "(id integer primary key, data blob)";

    self._db.get(query, function(err, row) {
      if(row !== undefined) {
        debug("Table Exists", table);
        return cb(null, table);
      } else  {
        debug("Creating Table", table);
        self._db.run(createTable, function() { cb(null, table);}, cb);
      }
    });
  };

};


var db = new Db();
db.init('data.db', ['user'], function() {
  db.save('user', {name: 'Barbara Fusinska'}, function(err) {
    console.log('Done');
  });
});



