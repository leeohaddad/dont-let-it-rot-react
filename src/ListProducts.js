'use strict';

var React = require('react');
var {
  Component
} = React;
var ReactNative = require('react-native');
var {
  Modal,
  Text,
  StyleSheet,
  ScrollView,
  View
} = ReactNative;
var ToolbarAndroid = require('ToolbarAndroid');

var ListProducts = React.createClass({
  componentDidMount: function() {
    // Update products List
  },
  getInitialState: function() {
    return {
      productsList: [{name:''}, {name:''}],
      listProducts: false
    };
  },
  render: function () {
    let ProductsList = this.state.productsList.map((a, i) => {
      return <Text key={i}>{a.name}</Text>                          
    })
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          actions={toolbarActions}
          logo={require('../img/icon_logo.png')}
          onActionSelected={this._onActionSelected}
          style={styles.toolbar}
          title="Don't Let It Rot!"
          titleColor="#ffffff" />
        <ScrollView>
          {ProductsList}
        </ScrollView>
      </View>
    );
  },
  _onActionSelected: function(position) {
  },
});

var toolbarActions = [];

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

module.exports = ListProducts;