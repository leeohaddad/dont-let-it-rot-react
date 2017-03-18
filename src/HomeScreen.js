'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  Modal,
  StyleSheet,
  ScrollView,
  View
} = ReactNative;
var ToolbarAndroid = require('ToolbarAndroid');
var Orientation = require('react-native-orientation');

var Product = require("./Product");
var AddProduct = require("./AddProduct");
var ListProducts = require("./ListProducts");
var DatabaseManager = require("./DatabaseManager");

var databaseManager = new DatabaseManager();
var apiBaseUrl = 'https://raw.githubusercontent.com/leeohaddad/dont-let-it-rot-react/master/sample-input.json';
var apiUrl = 'https://raw.githubusercontent.com/leeohaddad/dont-let-it-rot-react/master/sample-input.json';

var HomeScreen = React.createClass({
  componentDidMount: function () {
    if (Orientation == undefined || Orientation.lockToPortrait == undefined)
      alert("var Orientation is undefined!");
    else
      Orientation.lockToPortrait();
    databaseManager.openDatabase();
    this.updateCurrentList();
    this.updateProductsList();
  },
  updateCurrentList: function () {
    databaseManager.requestMyProductsList((data) => this.setCurrentList(data));
  },
  setCurrentList: function (data) {
    data.sort(function (a, b) {
      a = a.expireDate.split('/');
      b = b.expireDate.split('/');
      return a[2] - b[2] || a[1] - b[1] || a[0] - b[0];
    })
    this.setState({currList: data});
  },
  updateProductsList: function () {
    databaseManager.requestProductNamesList((data) => this.setProductsList(data));
  },
  setProductsList: function (data) {
    data.unshift({productId:0, name:'Escolher produto...'});
    this.setState({productsList: data});
  },
  getInitialState: function() {
    return {
      toolbarSwitch: false,
      colorProps: {
        titleColor: '#3b5998',
        subtitleColor: '#6a7180',
      },
      currList: [{productId:0, name:'Nome do Produto', quantity:0, expireDate:'31/02/2042', avatarSource:require('../img/placeholder.png')}],
      productsList: [{productId:0, name:'Escolher produto...', avatarSource:require('../img/placeholder.png')}],
      addProduct: false,
      listProducts: false
    };
  },
  render: function () {
    let MyProductsList = this.state.currList.map((a, i) => {
      return <Product productId={a.productId} name={a.name} quantity={a.quantity} expireDate={a.expireDate} avatarSource={a.avatarSource} database={databaseManager} root={this} key={i} />                            
    })
    return (
      <View style={{flex:1}}>
        <Modal
          style={{flex:1}}
          visible={this.state.addProduct}
          animationType={"slide"}
          onRequestClose={() => this.setState({addProduct: false})}>
          <AddProduct database={databaseManager} root={this} />
        </Modal>
        <Modal
          style={{flex:1}}
          visible={this.state.listProducts}
          animationType={"slide"}
          onRequestClose={() => this.setState({listProducts: false})}>
          <ListProducts database={databaseManager} root={this} />
        </Modal>
        <View style={styles.container}>
          <ToolbarAndroid
            actions={toolbarActions}
            logo={require('../img/icon_logo.png')}
            onActionSelected={this._onActionSelected}
            style={styles.toolbar}
            title="Don't Let It Rot!"
            titleColor="#ffffff" />
          <ScrollView>
            {MyProductsList}
          </ScrollView>
        </View>
      </View>
    );
  },
  addDataFromJson: function (json) {
    var addProductName = json.addProductName;
    var addMyProduct = json.addMyProduct;
    var PNlength = addProductName.length;
    for (var i = 0; i < PNlength; i++) {
      databaseManager.addProductName(addProductName[i].name, {uri:addProductName[i].avatarSource}, this.updateProductsList)
    }
    var MPlength = addMyProduct.length;
    for (var i = 0; i < MPlength; i++) {
      databaseManager.addMyProductByName(addMyProduct[i].name, addMyProduct[i].quantity, addMyProduct[i].expireDate, this.updateCurrentList)
    }
  },
  /* fetch data from some API ; in this case it is from a static server, but could be from a RESTful API */
  getDataFromApi: async function (url) {
    alert("Importing data from JSON...");
    var that = this;
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      that.addDataFromJson(responseJson);
      return responseJson;
    } catch(error) {
      alert(error);
      console.error(error);
    }
  },
  _onActionSelected: function(position) {
    var n = 3;
    if (position == n-3) {
      this.getDataFromApi(apiUrl);
    }
    if (position == n-2) {
      this.setState({listProducts: true});
    }
    else if (position == n-1) {
      this.setState({addProduct: true});
    }
  },
});

var toolbarActions = [
  {title: 'Download', icon: require('../img/icon_download.png'), show: 'always'},
  {title: 'List', icon: require('../img/icon_list.png'), show: 'always'},
  {title: 'Add', icon: require('../img/icon_plus.png'), show: 'always'},
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  toolbar: {
    backgroundColor: '#00aaaa',
    height: 56,
  },
});

module.exports = HomeScreen;