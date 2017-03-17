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
var Product = require("./Product");
var AddProduct = require("./AddProduct");
var ListProducts = require("./ListProducts");
var DatabaseManager = require("./DatabaseManager");
var databaseManager = new DatabaseManager();

var HomeScreen = React.createClass({
  componentDidMount: function () {
    databaseManager.openDatabase();
    this.updateCurrentList();
    this.updateProductsList();
  },
  updateCurrentList: function () {
    databaseManager.requestMyProductsList((data) => this.setCurrentList(data));
  },
  setCurrentList: function (data) {
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
      currList: [{productId:0, name:'Nome do Produto', quantity:0, expireDate:'31/02/2042'}],
      productsList: [{productId:0, name:'Escolher produto...'}],
      addProduct: false,
      listProducts: false
    };
  },
  render: function () {
    let MyProductsList = this.state.currList.map((a, i) => {
      return <Product productId={a.productId} name={a.name} quantity={a.quantity} expireDate={a.expireDate} key={i} />                            
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