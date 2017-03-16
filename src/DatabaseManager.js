'use strict';

var React = require('react');
var ReactNative = require('react-native');
var SQLite = require('react-native-sqlite-storage');

const database_name = "DLIR.db";
const database_version = "1.0";
const database_displayname = "DontLetItRot";
const database_size = 200000;
let db;

var DatabaseManager = React.createClass({

    componentWillUnmount: function () {
      this.closeDatabase();
    },

    openDatabase: function () {
      db = SQLite.openDatabase(database_name, database_version, database_displayname, database_size, () => console.log("OK: OPEN Database"), () => alert("FAIL: OPEN Database"));
      this.setupDatabase(db);
    },

    closeDatabase: function () {
      var that = this;
      if (db) {
        console.log("Closing database...");
        db.close(() => console.log("OK: CLOSE Database"), () => alert("FAIL: CLOSE Database"));
      } else {
        console.log("Database was not OPENED");
      }
    },

    queryProducts: function (db) {
      db.executeSql('SELECT * FROM ProductName', [],
        this.queryProductsSuccess, () => alert("FAIL: SELECT FROM ProductName"));
    },

    queryProductsSuccess: function (db,results) {
      if (results != undefined) {
        var len = results.rows.length;
        var result = "Result:";
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          result = result + " " + row.name + ";";
        }
        console.log(result);
        alert(result + " (" + len + ")");  
      }
      else alert("Results is undefined!");  
    },

    setupDatabase: function (db) {
      var that = this;
      // db.executeSql('DROP TABLE IF EXISTS Version;', [], () => console.log("OK: DROP TABLE Version"), () => alert("FAIL: DROP TABLE Version"));
      db.executeSql('SELECT 1 FROM Version LIMIT 1', [],
        function () {
          console.log("Database is ready!");
          // alert("Database is ready!");
          db.transaction(that.queryProducts,() => alert("FAIL: Transaction queryProducts"),function() {
            console.log("OK: Transaction queryProducts");
          });
        },
        function (error) {
          console.log("received version error:", error);
          db.transaction(that.createDatabase, () => alert("Could not create database!"), function () {
            console.log("Database created!");
            // alert("Database created!");
            db.transaction(that.queryProducts,() => alert("FAIL: Transaction queryProducts"),function() {
              console.log("OK: Transaction queryProducts");
            });
          });
      });
    },

    createDatabase: function (db) {
      console.log("Trying to create database...");

      db.executeSql('DROP TABLE IF EXISTS ProductName;', [], () => console.log("OK: DROP TABLE ProductName"), () => alert("FAIL: DROP TABLE ProductName"));
      db.executeSql('DROP TABLE IF EXISTS MyProduct;', [], () => console.log("OK: DROP TABLE MyProduct"), () => alert("FAIL: DROP TABLE MyProduct"));

      db.executeSql('CREATE TABLE IF NOT EXISTS Version( '
        + 'version_id INTEGER PRIMARY KEY NOT NULL); ', [], () => console.log("OK: CREATE TABLE Version"), () => alert("FAIL: CREATE TABLE Version"));

      db.executeSql('CREATE TABLE IF NOT EXISTS ProductName( '
        + 'product_id INTEGER PRIMARY KEY AUTOINCREMENT, '
        + 'name VARCHAR(30) ); ', [], () => console.log("OK: CREATE TABLE ProductName"), () => alert("FAIL: CREATE TABLE ProductName"));

      db.executeSql('CREATE TABLE IF NOT EXISTS MyProduct( '
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT, '
        + 'fk_product_id INTEGER, '
        + 'expireDate VARCHAR(10), '
        + 'FOREIGN KEY ( fk_product_id ) REFERENCES ProductName ( product_id )); ', [], () => console.log("OK: CREATE TABLE MyProduct"), () => alert("FAIL: CREATE TABLE MyProduct"));

      db.executeSql('INSERT INTO ProductName (name) VALUES ("Abóbora");', [], () => console.log("OK: Insert ProductName Abóbora"), () => alert("FAIL: Insert ProductName Abóbora"));
      db.executeSql('INSERT INTO ProductName (name) VALUES ("Fraldinha");', [], () => console.log("OK: Insert ProductName Fraldinha"), () => alert("FAIL: Insert ProductName Fraldinha"));

      console.log("Database was created successfully!");
    },

    render: function() {},
});

module.exports = DatabaseManager;