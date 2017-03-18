'use strict';

var React = require('react');
var ReactNative = require('react-native');
var SQLite = require('react-native-sqlite-storage');

const database_name = "DLIR.db";
const database_version = "1.0";
const database_displayname = "DontLetItRot";
const database_size = 200000;
let db;

const RESET_DB = false;
var myProductsList = [];


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

    addProductName: function (name,img,callback) {
      db.transaction((pdb) => this.checkDuplicatesToAddProductName(pdb,name,img,callback),() => alert("FAIL: Transaction checkDuplicatesToAddProductName"),function() {
        console.log("OK: Transaction checkDuplicatesToAddProductName");
      });
    },

    checkDuplicatesToAddProductName: function (db,name,img,callback) {
      db.executeSql('SELECT * FROM ProductName WHERE name="' + name + '"', [],
        (pdb,presults) => this.checkDuplicatesResultsToAddProductName(pdb,presults,name,img,callback), () => alert("FAIL: SELECT FROM ProductName"));
    },

    checkDuplicatesResultsToAddProductName: function (db,results,name,img,callback) {
      if (results != undefined) {
        var len = results.rows.length;
        if (len > 0) {
          console.log('Product "' + name + '" is already registered!');
          alert('O produto "' + name + '" já está cadastrado!');
        }
        else {
          db.executeSql('INSERT INTO ProductName (name,avatarSource) VALUES ("' + name + '","' + img.uri + '");', [], () => this.addedSuccesfully(callback), () => alert("FAIL: Insert ProductName"));
        }
      }
      else alert("Results is undefined!");  
    },

    addMyProduct: function (id,qtty,expireDate,callback) {
      db.transaction((pdb) => this.checkDuplicatesToAddMyProduct(pdb,id,qtty,expireDate,callback),() => alert("FAIL: Transaction checkDuplicatesToAddMyProduct"),function() {
        console.log("OK: Transaction checkDuplicatesToAddMyProduct");
      });
    },

    checkDuplicatesToAddMyProduct: function (db,id,qtty,expireDate,callback) {
      db.executeSql('SELECT * FROM MyProduct WHERE fk_product_id=' + id +
                    ' AND expireDate="' + expireDate + '"', [],
        (pdb,presults) => this.checkDuplicatesResultsToAddMyProduct(pdb,presults,id,qtty,expireDate,callback), () => alert("FAIL: SELECT FROM ProductName"));
    },

    checkDuplicatesResultsToAddMyProduct: function (db,results,id,qtty,expireDate,callback) {
      if (results != undefined) {
        var len = results.rows.length;
        if (len > 0) {
          db.executeSql('UPDATE MyProduct SET quantity=quantity+' + qtty + ' WHERE fk_product_id=' + id + ' AND expireDate="' + expireDate + '";', [], () => this.addedSuccesfully(callback), () => alert("FAIL: Update MyProduct"));
        }
        else {
          db.executeSql('INSERT INTO MyProduct (fk_product_id, quantity, expireDate) VALUES (' + id + ', ' + qtty + ', "' + expireDate + '");', [], () => this.addedSuccesfully(callback), () => alert("FAIL: Insert MyProduct"));
        }
      }
      else alert("Results is undefined!");  
    },

    addDataFromJson: function (json) {
      var addProductName = json.addProductName;
      var addMyProduct = json.addMyProduct;
      alert("PN " + addProductName.length);
      alert("MP " + addMyProduct.length);
    },

    addedSuccesfully: function (callback) {
      console.log("OK: INSERT");
      callback();
    },

    decreaseMyProduct: function (id,expireDate,callback) {
      db.executeSql('UPDATE MyProduct SET quantity=quantity-1 WHERE fk_product_id=' + id + ' AND expireDate="' + expireDate + '";', [], () => callback(), () => alert("FAIL: Decrease MyProduct"));
    },

    removeMyProduct: function (id,expireDate,callback) {
      db.executeSql('DELETE FROM MyProduct WHERE fk_product_id=' + id + ' AND expireDate="' + expireDate + '";', [], () => callback(), () => alert("FAIL: Remove MyProduct"));
    },

    requestProductNamesList: function (callback) {
      db.transaction((pdb) => this.queryProducts(pdb,callback),() => alert("FAIL: Transaction queryMyProducts"),function() {
        console.log("OK: Transaction queryMyProducts");
      });
    },

    queryProducts: function (db, callback) {
      db.executeSql('SELECT * FROM ProductName ORDER BY name', [],
        (pdb,presults) => this.queryProductsSuccess(pdb,presults,callback), () => alert("FAIL: SELECT FROM ProductName"));
    },

    queryProductsSuccess: function (db,results, callback) {
      if (results != undefined) {
        var len = results.rows.length;
        var data = [];
        var result = "Result:";
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push({productId: row.product_id, name: row.name, avatarSource: {uri: row.avatarSource}});
          result = result + " " + row.name + ";";
        }
        callback(data);
        console.log(result);
        // alert(result);
      }
      else alert("Results is undefined!");  
    },

    requestMyProductsList: function (callback) {
      db.transaction((pdb) => this.queryMyProducts(pdb,callback),() => alert("FAIL: Transaction queryMyProducts"),function() {
        console.log("OK: Transaction queryMyProducts");
      });
    },

    queryMyProducts: function (db,callback) {
      db.executeSql('SELECT MyProduct.*, ProductName.name, ProductName.avatarSource FROM MyProduct, ProductName WHERE ProductName.product_id = MyProduct.fk_product_id', [],
        (pdb,presults) => this.queryMyProductsSuccess(pdb,presults,callback), () => alert("FAIL: SELECT FROM ProductName"));
    },

    queryMyProductsSuccess: function (db,results,callback) {
      if (results != undefined) {
        var len = results.rows.length;
        var data = [];
        var result = "Result:";
        for (let i = 0; i < len; i++) {
          let row = results.rows.item(i);
          data.push({productId: row.fk_product_id, name: row.name, avatarSource: {uri: row.avatarSource}, quantity: row.quantity, expireDate: row.expireDate});
          result = result + " " + row.fk_product_id + " " + row.quantity + " " + row.expireDate + " " + row.name + ";";
        }
        callback(data);
        console.log(result);
        // alert(result);
      }
      else alert("Results is undefined!");  
    },

    setupDatabase: function (db) {
      var that = this;
      if (RESET_DB)
        db.executeSql('DROP TABLE IF EXISTS Version;', [], () => console.log("OK: DROP TABLE Version"), () => alert("FAIL: DROP TABLE Version"));
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
        + 'name VARCHAR(30), '
        + 'avatarSource VARCHAR(100) ); ', [], () => console.log("OK: CREATE TABLE ProductName"), () => alert("FAIL: CREATE TABLE ProductName"));

      db.executeSql('CREATE TABLE IF NOT EXISTS MyProduct( '
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT, '
        + 'fk_product_id INTEGER, '
        + 'quantity INTEGER, '
        + 'expireDate VARCHAR(10), '
        + 'FOREIGN KEY ( fk_product_id ) REFERENCES ProductName ( product_id )); ', [], () => console.log("OK: CREATE TABLE MyProduct"), () => alert("FAIL: CREATE TABLE MyProduct"));

      db.executeSql('INSERT INTO ProductName (name,avatarSource) VALUES ("Abóbora","../img/placeholder.jpg");', [], () => console.log("OK: Insert ProductName Abóbora"), () => alert("FAIL: Insert ProductName Abóbora"));
      db.executeSql('INSERT INTO ProductName (name,avatarSource) VALUES ("Fraldinha","../img/placeholder.jpg");', [], () => console.log("OK: Insert ProductName Fraldinha"), () => alert("FAIL: Insert ProductName Fraldinha"));

      console.log("Database was created successfully!");
    },

    render: function() {},
});

module.exports = DatabaseManager;