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
var sampleUrl = 'https://raw.githubusercontent.com/leeohaddad/dont-let-it-rot-react/master/input.json';

var HomeScreen = React.createClass({
  componentDidMount: function () {
    if (Orientation == undefined || Orientation.lockToPortrait == undefined)
      alert("undefined!");
    else
      Orientation.lockToPortrait();
    databaseManager.openDatabase();
    this.updateCurrentList();
    this.updateProductsList();
    this.getDataFromApi(sampleUrl);
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
      currList: [{productId:0, name:'Nome do Produto', quantity:0, expireDate:'31/02/2042', avatarSource:require('../img/placeholder.jpg')}],
      productsList: [{productId:0, name:'Escolher produto...', avatarSource:require('../img/placeholder.jpg')}],
      addProduct: false,
      listProducts: false
    };
  },
  /* fetch data from some API ; in this case it is from a static server, but could be from a RESTful API */
  getDataFromApi: async function (url) {
    var that = this;
    try {
      let response = await fetch(url);
      let responseJson = await response.json();
      that.databaseManager.addDataFromJson(responseJson);
      return responseJson;
    } catch(error) {
      alert(error);
      console.error(error);
    }
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
  _onActionSelected: function(position) {
    if (position == 0) {
      this.setState({listProducts: true});
    }
    else if (position == 1) {
      this.setState({addProduct: true});
    }
  },
});

var toolbarActions = [
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